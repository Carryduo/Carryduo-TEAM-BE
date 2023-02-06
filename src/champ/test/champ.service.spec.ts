import { CACHE_MANAGER, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampRepository } from '../champ.repository';
import { ChampService } from '../champ.service';
import { ChampEntity } from '../entities/champ.entity';
import * as champListData from './data/champ.list.json';
import * as preferChampUserData from './data/prefer.champ.user.list.json';
import * as champSpell from './data/champ.spell.json';
import * as champResponse from './data/champ.target.response.json';
import * as testData from './data/champ.info';
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

  // it('getTargetChampion은 존재하지 않는 챔피언id를 받으면 error return?', async () => {
  //   const result = await service.getTargetChampion('4', 'default');
  //   await expect(result).rejects.toThrowError(new HttpException('해당하는 챔피언 정보가 없습니다.', HttpStatus.BAD_REQUEST));
  // });

  //   it('getTargetChampion은 champion Id 가 없을 경우 error return?', async () => {
  //     const exception = '해당하는 챔피언 정보가 없습니다.';
  //     try {
  //       await service.getTargetChampion('100');
  //     } catch (err) {
  //       expect(err.message).toStrictEqual(exception);
  //     }
  //   });
});
