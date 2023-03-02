import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { SummonerEntity } from '../entities/summoner.entity';
import { SummonerHistoryEntity } from '../entities/summoner.history.entity';
import { SummonerRepository } from '../summoner.repository';
import { SummonerService } from '../summoner.service';
import { SummonerDtoFactory } from '../summoner.dto.factory';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import {
  RepositoryGetSummoner,
  summonerDto,
  summonerResponseDto,
  unrankSummonerDto,
} from './data/summoner.data';
import axios from 'axios';
import {
  matchData,
  matchIdData,
  mostChampsData,
  summonerData,
  summonerHistory,
  summonerLeagueInfoData,
  summonerLeagueInfoWithOutSoloRankData,
} from './data/riot.response';
import { plainToInstance } from 'class-transformer';
import { CreateSummonerDto } from '../dto/summoner/create.summoner.dto';

class CacheMockRepository {}
describe('SummonerService', () => {
  let configService: ConfigService;
  let service: SummonerService;
  let repository: SummonerRepository;
  let dto: SummonerDtoFactory;
  const mockRepository = () => {
    createQueryBuilder: jest.fn();
  };

  beforeAll(() => {
    // .env 파일 로드
    dotenv.config();
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        SummonerService,
        SummonerRepository,
        SummonerDtoFactory,
        {
          provide: axios,
          useValue: { get: jest.fn() },
        },
        {
          provide: getRepositoryToken(ChampEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(SummonerEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(SummonerHistoryEntity),
          useValue: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useClass: CacheMockRepository,
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
    service = module.get<SummonerService>(SummonerService);
    repository = module.get<SummonerRepository>(SummonerRepository);
    dto = module.get<SummonerDtoFactory>(SummonerDtoFactory);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getSummoner existSummoner 없으면 createSummoner실행?', async () => {
    const summonerName = '할배탈';
    const existSummoner = null;
    const request = jest.spyOn(axios, 'get');

    request.mockImplementation(async (url) => {
      return { data: { name: '할배탈' } };
    });

    repository.existSummoner = jest.fn().mockResolvedValue(existSummoner);
    repository.getSummoner = jest.fn().mockResolvedValue(RepositoryGetSummoner);
    service.summonerHistoryCalculation = jest.fn().mockResolvedValue(summonerResponseDto);

    //createSummoner
    const createSummoner = jest.spyOn(service, 'createSummoner');
    createSummoner.mockResolvedValue();

    await service.getSummoner(summonerName);

    expect(createSummoner).toBeCalled();
    expect(createSummoner).toHaveBeenCalledWith(summonerName);
  });

  it('requestRiotSummonerApi?', async () => {
    const summonerName = '할배탈';
    const request = jest.spyOn(axios, 'get');

    request.mockImplementation(async (url) => {
      switch (url) {
        case `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          summonerName,
        )}?api_key=${configService.get('RIOT_API_KEY')}`:
          return summonerData;

        case `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${
          summonerData.data.id
        }?api_key=${configService.get('RIOT_API_KEY')}`:
          return summonerLeagueInfoData;

        case `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${
          summonerData.data.id
        }/top?count=3&api_key=${configService.get('RIOT_API_KEY')}`:
          return mostChampsData;
      }
    });
    const result = await service.requestRiotSummonerApi(summonerName);
    const response = plainToInstance(CreateSummonerDto, summonerDto);

    expect(result).toEqual(response);
  });

  it('requestRiotSummonerApi 솔로랭크 정보 없는 버전 return?', async () => {
    const summonerName = '할배탈';
    const request = jest.spyOn(axios, 'get');

    request.mockImplementation(async (url) => {
      switch (url) {
        case `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          summonerName,
        )}?api_key=${configService.get('RIOT_API_KEY')}`:
          return summonerData;

        case `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${
          summonerData.data.id
        }?api_key=${configService.get('RIOT_API_KEY')}`:
          return summonerLeagueInfoWithOutSoloRankData;

        case `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${
          summonerData.data.id
        }/top?count=3&api_key=${configService.get('RIOT_API_KEY')}`:
          return mostChampsData;
      }
    });
    const result = await service.requestRiotSummonerApi(summonerName);
    const response = plainToInstance(CreateSummonerDto, unrankSummonerDto);

    expect(result).toEqual(response);
  });

  it('requestRiotSummonerHistoryApi?', async () => {
    const puuId = 'puuid';
    const request = jest.spyOn(axios, 'get');

    request.mockImplementation(async (url) => {
      switch (url) {
        case `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${configService.get(
          'RIOT_API_KEY',
        )}`:
          return matchIdData;

        case `https://asia.api.riotgames.com/lol/match/v5/matches/${
          matchIdData.data
        }?api_key=${configService.get('RIOT_API_KEY')}`:
          return matchData;
      }
    });

    const result = await service.requestRiotSummonerHistoryApi(puuId);
    const response = await dto.createSummonerHistory(summonerHistory);

    expect(result).toEqual(response);
  });

  it('refreshSummoner 소환사 정보 없으면 error?', async () => {
    let error = null;
    const summonerName = '할배탈';
    try {
      repository.existSummoner = jest.fn().mockResolvedValue(null);
      await service.refreshSummoner(summonerName);
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
  });
});
