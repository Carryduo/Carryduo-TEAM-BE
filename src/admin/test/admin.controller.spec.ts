import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChampRepository } from 'src/champ/champ.repository';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { ChampRateEntity } from 'src/champ/entities/champ.rate.entity';
import { ChampSpellEntity } from 'src/champ/entities/champ.spell';
import { ChampSkillInfoEntity } from 'src/champ/entities/champSkillInfo.entity';
import { CommentRepository } from 'src/comments/comments.repository';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { AdminController } from '../admin.controller';
import { AdminRepository } from '../admin.repository';
import { AdminService } from '../admin.service';
class MockChache {}

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;
  const mockRepository = () => {
    createQueryBuilder: jest.fn();
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AdminService,
        AdminRepository,
        ChampRepository,
        CommentRepository,
        UserRepository,
        {
          provide: JwtService,
          useValue: {
            signAsync: (payload, option) => {
              return 'sample token';
            },
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ChampEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ChampRateEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ChampSkillInfoEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ChampSpellEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockRepository,
        },
        { provide: CACHE_MANAGER, useClass: MockChache },
        {
          provide: ConfigService,
          useValue: {
            get: (category) => {
              return category;
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
