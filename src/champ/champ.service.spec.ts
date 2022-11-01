import { CACHE_MANAGER } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ChampRepository } from './champ.repository';
import { ChampService } from './champ.service';
import { ChampEntity } from './entities/champ.entity';
import { ChampRateEntity } from './entities/champ.rate.entity';
import { ChampSpellEntity } from './entities/champ.spell';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';
import * as champList from '../../test/champ.service.test/champ.list.json';
import * as preferChampUserList from '../../test/champ.service.test/prefer.champ.user.list.json';

class MockRepository {}
class MockUserRepository {}
class MockChache {}
describe('ChampService', () => {
  let service: ChampService;
  let repository: ChampRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChampService,
        ChampRepository,
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
    jest.spyOn(repository, 'getChampList').mockResolvedValue(champList);
    expect(await service.getChampList()).toBe(champList);

    expect(service.getChampList);
  });
});
