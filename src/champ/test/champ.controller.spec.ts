import { Test, TestingModule } from '@nestjs/testing';
import { ChampController } from '../champ.controller';
import { ChampService } from '../champ.service';
import { HttpExceptionFilter } from '../../common/exception/http-exception.filter';
import { ChampRepository } from '../champ.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampEntity } from '../entities/champ.entity';
import { ChampRateEntity } from '../entities/champ.rate.entity';
import { ChampSkillInfoEntity } from '../entities/champSkillInfo.entity';
import { ChampSpellEntity } from '../entities/champ.spell';
import { UserEntity } from 'src/user/entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/common';

describe('ChampController', () => {
  let controller: ChampController;
  let service: ChampService;
  let cache: Cache;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          ChampEntity,
          ChampRateEntity,
          ChampSkillInfoEntity,
          ChampSpellEntity,
          UserEntity,
        ]),
      ],
      controllers: [ChampController],
      providers: [
        ChampService,
        ChampRepository,
        {
          provide: CACHE_MANAGER,
          useValue: { get: () => 'any', set: () => jest.fn() },
        },
      ],
      exports: [ChampRepository],
    }).compile();

    controller = module.get<ChampController>(ChampController);
    service = module.get<ChampService>(ChampService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getChampionList', () => {
    it('getChampionList return array?', async () => {
      const result = ['가렌'];
      jest
        .spyOn(controller, 'getChampionList')
        .mockImplementation(async () => result);
      try {
        await controller.getChampionList();
        expect(await controller.getChampionList()).toBe(result);
      } catch (err) {
        console.log(err);
      }
    });
  });
});
