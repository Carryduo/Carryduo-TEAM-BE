import { CACHE_MANAGER, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampRepository } from './champ.repository';
import { ChampService } from './champ.service';
import { ChampEntity } from './entities/champ.entity';
import { ChampRateEntity } from './entities/champ.rate.entity';
import { ChampSpellEntity } from './entities/champ.spell';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';
import * as champList from '../../test/champ.service.test/champ.list.json';
import * as preferChampUserList from '../../test/champ.service.test/prefer.champ.user.list.json';
import * as detailChampInfo from '../../test/champ.service.test/champ.detail.json';

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
    for (let p of this.preferChamp) {
      if (p.preferChamp === champId) {
        return preferChampUserList;
      } else {
        return [];
      }
    }
  }

  // getTargetChampion(champId) {
  // if (!this.champIds.includes(champId)) {
  //   console.log(champId);
  //   throw new HttpException(
  //     '해당하는 챔피언 정보가 없습니다.',
  //     HttpStatus.BAD_REQUEST,
  //   );
  // } else {
  // return detailChampInfo;
  // }
  // }
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
          provide: getRepositoryToken(ChampRateEntity),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(ChampSkillInfoEntity),
          useClass: MockRepository,
        },
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
    expect(await service.getPreferChampUsers(champId)).toStrictEqual(
      preferChampUserList,
    );
  });

  it('getPreferChampUsers는 champId를 못찾으면 빈 배열을 return?', async () => {
    const champId = '100';
    expect(await service.getPreferChampUsers(champId)).toStrictEqual([]);
  });

  it.todo('getTargetChampion은 champion의 정보를 return?', async () => {
    expect(await service.getTargetChampion('1')).toStrictEqual(detailChampInfo);
  });
});
