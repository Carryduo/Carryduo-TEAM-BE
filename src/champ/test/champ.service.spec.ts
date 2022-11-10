import { CACHE_MANAGER, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampRepository } from '../champ.repository';
import { ChampService } from '../champ.service';
import { ChampEntity } from '../entities/champ.entity';
import { ChampSpellEntity } from '../entities/champ.spell';
import * as champList from './data/champ.list.json';
import * as preferChampUserList from './data/prefer.champ.user.list.json';
import * as champSpell from './data/champ.spell.json';
import * as champResponse from './data/champ.target.response.json';
import * as testData from './data/champ.info';

class MockRepository {}

class MockUserRepository {}

class MockChampRepository {
  champIds = ['1', '2', '3', '4', '5'];
  preferChamp = [
    { preferChamp: '1', user: 'kim' },
    { preferChamp: '1', user: 'lee' },
    { preferChamp: '2', user: 'park' },
  ];
  getChampList() {
    return champList;
  }
  findPreferChampUsers(champId) {
    for (const p of this.preferChamp) {
      if (p.preferChamp === champId) {
        return preferChampUserList;
      } else {
        return [];
      }
    }
  }

  getTargetChampion(champId) {
    if (!this.champIds.includes(champId)) {
      throw new HttpException('해당하는 챔피언 정보가 없습니다.', HttpStatus.BAD_REQUEST);
    } else {
      return testData.champInfo;
    }
  }

  getChampSpell(champId) {
    return champSpell;
  }
}

class MockChache {}

describe('ChampService', () => {
  let service: ChampService;
  let repository: ChampRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChampService,
        { provide: ChampRepository, useClass: MockChampRepository },
        { provide: getRepositoryToken(ChampEntity), useClass: MockRepository },
        {
          provide: getRepositoryToken(ChampSpellEntity),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockUserRepository,
        },
        { provide: CACHE_MANAGER, useClass: MockChache },
      ],
    }).compile();

    service = module.get<ChampService>(ChampService);
    repository = module.get<ChampRepository>(ChampRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getChampList return champList?', async () => {
    expect(await service.getChampList()).toBe(champList);
  });

  it('getPreferChampUsers는 champId를 찾으면 preferChampUserList return?', async () => {
    const champId = '1';
    expect(await service.getPreferChampUsers(champId)).toEqual(preferChampUserList);
  });

  it('getPreferChampUsers는 champId를 못찾으면 빈 배열을 return?', async () => {
    const champId = '100';
    expect(await service.getPreferChampUsers(champId)).toEqual([]);
  });

  it('getTargetChampion은 detailChampInfo를 리턴?', async () => {
    expect(await service.getTargetChampion('1')).toEqual(champResponse);
  });

  it('getTargetChampion은 champion Id 가 없을 경우 error return?', async () => {
    const exception = '해당하는 챔피언 정보가 없습니다.';
    try {
      await service.getTargetChampion('100');
    } catch (err) {
      expect(err.message).toStrictEqual(exception);
    }
  });
});
