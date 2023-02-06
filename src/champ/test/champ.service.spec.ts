import { CACHE_MANAGER, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampRepository } from '../champ.repository';
import { ChampService } from '../champ.service';
import { ChampEntity } from '../entities/champ.entity';
import * as champListData from './data/champ.list.json';
import * as preferChampUserData from './data/prefer.champ.user.list.json';
import * as targetChampionResponseData from './data/champ.target.response.json';
import * as champData from './data/champ.info';
import { GameInfoEntity } from '../entities/game.info.entity';
import { UpdateChampRateEntity } from '../entities/update.champ.rate.entity';

class MockRepository {
  getChampList() {
    return champListData;
  }
  findPreferChampUsers(champId: string) {
    const preferChampIdList = ['1', '2', '3', '4'];
    const preferChampUser = preferChampIdList.includes(champId) ? preferChampUserData : [];
    return preferChampUser;
  }
  getTargetChampion(champId: string, position: string) {}

  existChamp(champId: string) {
    const existChampList = ['1', '2', '3'];
    return existChampList.includes(champId) ? true : false;
  }
  rateVersion() {
    return [{ version: '12.23' }, { version: '13.1.' }];
  }
  getMostPosition(champId: string, version: string) {
    const champPositionInfo = [
      { champId: '1', position: 'MIDDLE', version: '12.23' },
      { champId: '1', position: 'BOTTOM', version: '12.21' },
      { champId: '1', position: 'JUNGLE', version: '13.1.' },
    ];
    const mostPosition = [champPositionInfo.find((v) => v.champId === champId && v.version === version)];
    return mostPosition;
  }
  getChampData(champId: string, position: string, version: string) {
    const { champDefaultData } = champData;
    const { skillInfo } = champData;
    const { champInfo } = champData;
    return { champDefaultData, skillInfo, champInfo };
  }
  getBanRate() {
    return { banCount: '0.2546' };
  }
}

class MockChache {}

describe('ChampService', () => {
  let service: ChampService;
  let repository: ChampRepository;
  const env = process.env;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChampService,
        { provide: ChampRepository, useClass: MockRepository },
        { provide: getRepositoryToken(ChampEntity), useClass: MockRepository },
        { provide: getRepositoryToken(GameInfoEntity), useClass: MockRepository },
        { provide: getRepositoryToken(UpdateChampRateEntity), useClass: MockRepository },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockRepository,
        },
        { provide: CACHE_MANAGER, useClass: MockChache },
      ],
    }).compile();

    service = module.get<ChampService>(ChampService);
    repository = module.get<ChampRepository>(ChampRepository);
    jest.resetModules();
    process.env = { ...env, S3_ORIGIN_URL: `https://ddragon.leagueoflegends.com/cdn/12.19.1/img` };
  });
  afterEach(() => {
    process.env = env;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getChampList return champList?', async () => {
    const champList = await service.getChampList();
    expect(champList).toBe(champListData);
  });

  it('해당 챔피언을 선호하는 유저가 있으면 유저의 정보, 없으면 빈 배열을 return?', async () => {
    let champId = '1';
    let preferUsers = await service.getPreferChampUsers(champId);
    expect(preferUsers).toEqual(preferChampUserData);

    champId = '6';
    preferUsers = await service.getPreferChampUsers(champId);
    expect(preferUsers).toEqual([]);
  });

  it('getTargetChampion은 존재하지 않는 챔피언id를 받으면 error return?', async () => {
    let error = null;
    try {
      await service.getTargetChampion('4', 'default');
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
  });

  it('getTargetChampion에서 포지션 파라미터가 default인 경우 mostPosition을 찾아서 해당 데이터를 return?', async () => {
    const result = await service.getTargetChampion('1', 'default');
    expect(result).toEqual(targetChampionResponseData);
  });
});
