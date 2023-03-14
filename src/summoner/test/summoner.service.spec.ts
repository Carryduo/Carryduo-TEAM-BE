import { CACHE_MANAGER, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { SummonerEntity } from '../entities/summoner.entity';
import { SummonerHistoryEntity } from '../entities/summoner.history.entity';
import { SummonerRepository } from '../summoner.repository';
import { SummonerService } from '../summoner.service';
import { TransferSummonerData } from '../summoner.data.transfer';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
import {
  positionInfoData,
  recentChampInfoData,
  recentChampRateData,
  recordSumInfoData,
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
import { SummonerCommonDTO } from '../dto/summoner/summoner.common.dto';

class CacheMockRepository {}
describe('SummonerService', () => {
  let configService: ConfigService;
  let service: SummonerService;
  let repository: SummonerRepository;
  let transfer: TransferSummonerData;
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
        TransferSummonerData,
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
    transfer = module.get<TransferSummonerData>(TransferSummonerData);
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

  it('getSummoner 존재하지 않는 소환사 입력시 error return?', async () => {
    const summonerName = '할배탈';
    const request = jest.spyOn(axios, 'get');
    request.mockRejectedValue({ response: { statusText: 'Not Found', status: 404 } });

    try {
      await service.getSummoner(summonerName);
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.message).toEqual('Not Found - from getSummoner');
      expect(err.status).toEqual(404);
    }
  });

  it('requestRiotSummonerApi? 정상 return', async () => {
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

  it('requestRiotSummonerHistoryApi 정상 return?', async () => {
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
    const response = await transfer.summonerHistoryEntity(summonerHistory);

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

  it('소환사 전적 데이터 연산 정상 작동 return?', async () => {
    const summoner = plainToInstance(SummonerCommonDTO, summonerDto);
    const summonerDefaultData = await transfer.summonerDefaultData(summoner);
    repository.getSummonerRecordSum = jest.fn().mockResolvedValue(recordSumInfoData);

    repository.getSummonerPositionRecord = jest.fn().mockResolvedValue(positionInfoData);
    const position = await transfer.summonerPosition(positionInfoData);

    repository.getRecentChamp = jest.fn().mockResolvedValue(recentChampInfoData);
    repository.getRecentChampRate = jest.fn().mockResolvedValue(recentChampRateData);
    const recentChamp = await transfer.summonerRecentChamp(
      recentChampInfoData,
      summoner.summonerId,
    );

    const historyRate = await transfer.summonerHistoryRate(
      recordSumInfoData,
      position,
      recentChamp,
    );

    const response = await transfer.SummonerHistoryResponse(summonerDefaultData, historyRate);

    const result = await service.summonerHistoryCalculation(summoner);

    expect(response).toEqual(result);
  });

  it('소환사 전적 데이터 연산 error test', async () => {
    const summoner = null;
    let error = null;
    try {
      await service.summonerHistoryCalculation(summoner);
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
  });

  it('createSummoner error test', async () => {
    const summonerName = '할배탈';
    let error = null;
    service.requestRiotSummonerApi = jest.fn().mockResolvedValue(null);
    try {
      await service.createSummoner(summonerName);
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
  });
});
