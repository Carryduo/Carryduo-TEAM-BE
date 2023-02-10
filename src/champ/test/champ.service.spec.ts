import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampRepository } from '../champ.repository';
import { ChampService } from '../champ.service';
import { ChampEntity } from '../entities/champ.entity';
import { champListData } from './data/champ.list';
import * as preferChampUserData from './data/prefer.champ.user.list.json';
import * as responseData from './data/champ.target.response';
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

  existChamp(champId: string) {
    const existChampList = ['1', '2', '3'];
    return existChampList.includes(champId) ? true : false;
  }
  rateVersion() {
    return [{ version: '12.23' }, { version: '13.1.' }];
  }
  getMostPosition(champId: string, version: string) {
    //id:2에 해당하는 챔피언 데이터가 없는 경우
    if (champId === '2') return [];

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
    const champInfo = champData[position];

    //id:2에 해당하는 챔피언 데이터가 없는 경우
    if (champId === '2') {
      return { champDefaultData, skillInfo, champInfo: champData.DEFAULT };
    }

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

  // it('getChampList return champList?', async () => {
  //   const champList = await service.getChampList();
  //   expect(champList).toBe(champListData);
  // });

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
    const Param = {
      champId: '4',
      position: 'default',
    };
    try {
      await service.getTargetChampion(Param);
    } catch (err) {
      error = err;
    }
    expect(error).not.toBeNull();
  });

  it('getTargetChampion에서 포지션 파라미터가 default인 경우 mostPosition을 찾는가?', async () => {
    const champId = '1';
    const version = '13.1.';

    const Param = {
      champId: '1',
      position: 'default',
    };

    const positionList = {
      top: 'TOP',
      jungle: 'JUNGLE',
      mid: 'MIDDLE',
      ad: 'BOTTOM',
      support: 'UTILITY',
      default: 'default',
    };
    let emptyPosition = positionList[Param.position] === 'default' ? true : false;

    let getMostPosition = jest.spyOn(repository, 'getMostPosition').mockImplementation(async (champId: string, version: string) => {
      const positionInfo = [
        { champId: '1', position: 'JUNGLE', version: '13.1.' },
        { champId: '1', position: 'TOP', version: '12.1' },
      ];
      const MostPosition = [positionInfo.find((v) => v.champId === champId && v.version === version)];
      return MostPosition;
    });

    const mostPosition = emptyPosition && (await repository.getMostPosition(Param.champId, version));

    expect(getMostPosition).toBeCalled();
    expect(mostPosition[0].position).toBe('JUNGLE');

    const Param2 = Param;
    Param2.position = 'mid';
    console.log(Param, Param2);
    //default 파라미터가 아닌 경우
    emptyPosition = positionList[Param2.position] === 'default' ? true : false;
    const targetPosition = emptyPosition ? await repository.getMostPosition(champId, version) : positionList[Param2.position];

    //default 파라미터였던 상황만 실행되므로 mid로 주워진 targetPosition에선 실행이 안돼서 1번만 실행됨
    expect(getMostPosition).toHaveBeenCalledTimes(1);
    expect(targetPosition).toBe('MIDDLE');
  });

  it('getTargetChampion에서 포지션 파라미터가 default인 경우 mostPosition을 찾아서 포지션에 맞는 데이터를 return?', async () => {
    const version = '13.1.';

    const param = {
      champId: '1',
      position: 'default',
    };

    const result = await service.getTargetChampion(param);

    const targetPosition = await repository.getMostPosition(param.champId, version);

    expect(targetPosition[0]?.position).toEqual('JUNGLE');
    expect(result).toEqual(responseData.JUNGLE);
  });

  it('getTargetChampion에서 포지션 파라미터의 값대로 response를 return?', async () => {
    const Param = {
      champId: '1',
      position: 'mid',
    };

    const result = await service.getTargetChampion(Param);
    expect(result).toEqual(responseData.MID);
  });

  it('getTargetChampion에서 특정 챔피언의 정보가 없으면 default data return?', async () => {
    const Param = {
      champId: '2',
      position: 'default',
    };
    const result = await service.getTargetChampion(Param);
    expect(result).toEqual(responseData.DEFAULT);
  });
});
