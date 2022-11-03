import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerHistoryDataCleansing } from '../data-cleansing/history.data.cleansing';
import { summonerResponseCleansing } from '../data-cleansing/summoner.data.cleansing';
import { SummonerEntity } from '../entities/summoner.entity';
import { SummonerHistoryEntity } from '../entities/summoner.history.entity';
import { SummonerRepository } from '../summoner.repository';
import { SummonerService } from '../summoner.service';
import axios from 'axios';
import * as summonerData from './data/summoner.response';
import * as detailResponse from './data/detail.response';
import * as mostChampData from './data/most.champ.response';
import * as matchIdData from './data/match.id.response.data';
import * as matchData from './data/match.data.response';

class MockRepository {}
class CacheMockRepository {}
class MockSummonerRepository {
  getSummonerHistory() {
    return 'test';
  }
  deleteSummonerHistory() {
    return true;
  }
  createSummonerHistory() {
    return true;
  }
}
describe('SummonerService', () => {
  let service: SummonerService;
  let repository: SummonerRepository;
  beforeEach(async () => {
    jest.setTimeout(130000);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummonerService,
        summonerResponseCleansing,
        SummonerHistoryDataCleansing,
        { provide: SummonerRepository, useClass: MockSummonerRepository },
        { provide: axios, useValue: { get: jest.fn() } },
        {
          provide: getRepositoryToken(ChampEntity),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(SummonerEntity),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(SummonerHistoryEntity),
          useClass: MockRepository,
        },
        { provide: CACHE_MANAGER, useClass: CacheMockRepository },
      ],
    }).compile();

    service = module.get<SummonerService>(SummonerService);
    repository = module.get<SummonerRepository>(SummonerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('summonerRiotRequest return data?', async (done) => {
    process.env.RIOT_API_KEY = 'key';
    jest.spyOn(axios, 'get').mockImplementation(
      (url) =>
        new Promise((resolve) => {
          if (
            url ===
            `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/%ED%95%A0%EB%B0%B0%ED%83%88?api_key=key`
          ) {
            resolve(summonerData);
          } else if (
            url ===
            `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.data.id}?api_key=key`
          ) {
            resolve(detailResponse);
          } else if (
            url ===
            `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerData.data.id}/top?count=3&api_key=key`
          ) {
            resolve(mostChampData);
          } else if (
            url ===
            `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerData.data.puuid}/ids?start=0&count=10&api_key=key`
          ) {
            resolve(matchIdData);
          } else if (
            url ===
            `https://asia.api.riotgames.com/lol/match/v5/matches/[object Object]?api_key=key`
          ) {
            resolve(matchData);
          }
        }),
    );
    expect(await service.summonerRiotRequest('할배탈')).toBe('data');
    done();
  });
});
