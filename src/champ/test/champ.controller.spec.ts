import { Test, TestingModule } from '@nestjs/testing';
import { ChampController } from '../champ.controller';
import { ChampService } from '../champ.service';
import { ChampRepository } from '../champ.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChampEntity } from '../entities/champ.entity';
import { ChampSkillInfoEntity } from '../entities/champSkillInfo.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/common';
import { GameInfoEntity } from '../entities/game.info.entity';
import { UpdateChampRateEntity } from '../entities/update.champ.rate.entity';

class MockRepository {}
class MockChache {}

describe('ChampController', () => {
  let controller: ChampController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChampController],
      providers: [
        ChampService,
        ChampRepository,
        { provide: getRepositoryToken(ChampEntity), useClass: MockRepository },
        { provide: getRepositoryToken(GameInfoEntity), useClass: MockRepository },
        { provide: getRepositoryToken(UpdateChampRateEntity), useClass: MockRepository },
        {
          provide: getRepositoryToken(ChampSkillInfoEntity),
          useClass: MockRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: MockRepository,
        },
        { provide: CACHE_MANAGER, useClass: MockChache },
      ],
    }).compile();

    controller = module.get<ChampController>(ChampController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
