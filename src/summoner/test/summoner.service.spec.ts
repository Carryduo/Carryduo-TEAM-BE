import { CACHE_MANAGER, HttpException } from '@nestjs/common';
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
import * as detailData from './data/detail.response';
import * as mostChampData from './data/most.champ.response';
import * as matchIdData from './data/match.id.response.data';
import * as matchData from './data/match.data.response';
import * as riotResponse from './data/riot.response.data';
import { resolve } from 'path';

class MockRepository {}
class CacheMockRepository {}

class MockSummonerRepository {
  getSummonerHistory(key) {
    if (key) {
      return summonerData.summonerHistory;
    } else if (!key) {
      return false;
    }
  }
  deleteSummonerHistory(key) {
    if (this.getSummonerHistory(key)) {
      return true;
    } else if (!this.getSummonerHistory(key)) {
      return false;
    }
  }
  createSummonerHistory() {
    return true;
  }
  findSummoner(summonerName) {
    if (summonerName) {
      return summonerData.findSummoner;
    } else if (!summonerName) {
      return null;
    }
  }
  sumWin(summonerName) {
    return { totalCnt: 10, winCnt: 8 };
  }
  recentChamp(summonerName) {
    return [
      { history_champ_id: 360, champCnt: 4 },
      { history_champ_id: 145, champCnt: 1 },
      { history_champ_id: 42, champCnt: 1 },
    ];
  }
  recentChampInfo(summonerName) {
    const recentChampInfo = {
      champ_champ_name_ko: '사미라',
      champ_champ_img:
        'https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/Samira.png',
    };

    return recentChampInfo;
  }
  recentChampRate(summonerName, champName) {
    const recentChampRateInfo = {
      win: { history_champ_id: 360, winCnt: 4 },
      lose: { history_champ_id: null, loseCnt: 0 },
    };
    return recentChampRateInfo;
  }
  position(summonerName, id) {
    const position = { history_position: 3, positionCnt: 2 };
    return position;
  }
  kdaAverage(summonerName) {
    return { killSum: 75, deathSum: 53, assistSum: 96 };
  }
  cacheSummoner() {
    return true;
  }
  updateSummoner(summoner) {
    return;
  }
}

describe('SummonerService', () => {
  let service: SummonerService;
  let repository: SummonerRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummonerService,
        summonerResponseCleansing,
        SummonerHistoryDataCleansing,
        { provide: SummonerRepository, useClass: MockSummonerRepository },
        {
          provide: axios,
          useValue: { get: jest.fn() },
        },
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
        {
          provide: CACHE_MANAGER,
          useClass: CacheMockRepository,
        },
      ],
    }).compile();

    service = module.get<SummonerService>(SummonerService);
    repository = module.get<SummonerRepository>(SummonerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('summonerRiotRequest return data?', async () => {
    process.env.RIOT_API_KEY = 'key';
    const summonerName = '할배탈';
    const puuId = summonerData.data.puuid;
    jest.spyOn(axios, 'get').mockImplementation(async (url) => {
      switch (url) {
        case `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          summonerName,
        )}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('summoner');
          return summonerData;
        case `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.data.id}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('detail');
          return detailData;
        case `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerData.data.id}/top?count=3&api_key=${process.env.RIOT_API_KEY}`:
          console.log('most');
          return mostChampData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchId');
          return matchIdData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[0]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[1]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[2]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[3]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[4]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[5]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[6]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[7]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[8]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/${matchIdData.data[9]}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchData');
          return matchData;
      }
      jest
        .spyOn(repository, 'getSummonerHistory')
        .mockImplementation(async (value) => value);
    });
    expect(await service.summonerRiotRequest('할배탈')).toEqual(
      riotResponse.summonerData,
    );
  });

  it('detail data가 없으면 error return?', () => {
    try {
      process.env.RIOT_API_KEY = 'key';
      const summonerName = '할배탈';
      jest.spyOn(axios, 'get').mockImplementation(async (url) => {
        switch (url) {
          case `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
            summonerName,
          )}?api_key=${process.env.RIOT_API_KEY}`:
            console.log('summoner');
            return summonerData;
          case `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.data.id}?api_key=${process.env.RIOT_API_KEY}`:
            console.log('detail');
            return null;
        }
      });
    } catch (err) {
      expect(err).toBe('언랭크 소환사 입니다.');
    }
  });

  it('error response에 따른 error return?', () => {
    try {
      process.env.RIOT_API_KEY = 'key';
      const summonerName = '할배탈';
      jest.spyOn(axios, 'get').mockImplementation(async (url) => {
        switch (url) {
          case `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
            summonerName,
          )}?api_key=${process.env.RIOT_API_KEY}`:
            console.log('summoner');
            throw new HttpException('too many', 429);
          case `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.data.id}?api_key=${process.env.RIOT_API_KEY}`:
            console.log('detail');
            throw new HttpException('Forbidden', 403);
        }
      });
    } catch (err) {
      expect(err).toBe('라이엇API 요청 과도화');
      expect(err).toBe('라이엇API 키 만료');
    }
  });

  it('getSummonerHistory 가 있으면 History를 삭제하고 없으면 삭제하지 않나?', async () => {
    process.env.RIOT_API_KEY = 'key';
    const summonerName = '할배탈';
    const puuId = summonerData.data.puuid;
    jest.spyOn(axios, 'get').mockImplementation(async (url) => {
      switch (url) {
        case `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          summonerName,
        )}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('summoner');
          return summonerData;
        case `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.data.id}?api_key=${process.env.RIOT_API_KEY}`:
          console.log('detail');
          return detailData;
        case `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerData.data.id}/top?count=3&api_key=${process.env.RIOT_API_KEY}`:
          console.log('most');
          return mostChampData;
        case `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${process.env.RIOT_API_KEY}`:
          console.log('matchId');
          return matchIdData;
      }
    });
    await repository.getSummonerHistory(summonerName);
    expect(await repository.deleteSummonerHistory(summonerName)).toBeTruthy();
    await repository.getSummonerHistory(false);
    expect(await repository.deleteSummonerHistory(false)).toBeFalsy();
  });

  it('getSummoner 의 return 값이 잘 나오는가?', async () => {
    const summonerName = '할배탈';

    await repository.findSummoner(summonerName);

    expect(await service.getSummoner(summonerName)).toEqual(
      summonerData.summonerData,
    );
  });

  it('getSummoner summoner가 있으면 DataCleansing으로 없으면 saveSummoner가 실행되는가?', async () => {
    const summonerName = '할배탈';

    const cleansingData = jest
      .spyOn(service, 'cleansingData')
      .mockResolvedValue(summonerData.saveSummoner);

    await repository.findSummoner(summonerName);
    await service.getSummoner(summonerName);

    expect(cleansingData).toHaveBeenCalled();

    jest.spyOn(repository, 'findSummoner').mockResolvedValue(null);
    const saveSummoner = jest
      .spyOn(service, 'saveSummoner')
      .mockResolvedValue(summonerData.saveSummoner);

    await service.getSummoner(summonerName);

    expect(saveSummoner).toHaveBeenCalled();
  });

  it('refreshSummonerData의 전적갱신할 summoner 가 있으면 data를 return? 없으면 error return?', async () => {
    const summonerName = '할배탈';
    await repository.findSummoner(summonerName);
    jest
      .spyOn(service, 'summonerRiotRequest')
      .mockResolvedValue(riotResponse.summonerData);

    jest.spyOn(repository, 'updateSummoner').mockResolvedValue();

    await service.refreshSummonerData(summonerName);
    expect(await service.refreshSummonerData(summonerName)).toEqual(
      summonerData.summonerData,
    );
    try {
      jest.spyOn(repository, 'findSummoner').mockResolvedValue(null);
      await service.refreshSummonerData(summonerName);
    } catch (err) {
      expect(err.message).toBe(
        '갱신할 수 없는 소환사입니다.(DB에 소환사가 없습니다.)',
      );
    }
  });
});
