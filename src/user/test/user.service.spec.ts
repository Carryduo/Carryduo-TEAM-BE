import { UserRepository } from 'src/user/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { createQueryBuilder } from 'typeorm';
import { ChampRepository } from 'src/champ/champ.repository';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { ChampSpellEntity } from 'src/champ/entities/champ.spell';
import { ChampSkillInfoEntity } from 'src/champ/entities/champSkillInfo.entity';
import { ChampRateEntity } from 'src/champ/entities/champ.rate.entity';
import { CACHE_MANAGER } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let champRepository: ChampRepository;
  const mockRepository = () => {
    createQueryBuilder: jest.fn();
  };
  class MockChache {}
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        ChampRepository,
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
        { provide: CACHE_MANAGER, useClass: MockChache },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    champRepository = module.get<ChampRepository>(ChampRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getUserInfo ?????????: ??????????????? ?????? repository??? option??? ????????? ??????????', async () => {
    jest.spyOn(userRepository, 'getUserInfo').mockImplementation(
      (option, userId) =>
        new Promise((resolve) => {
          resolve(option.length);
        }),
    );
    // ???????????? ??????
    expect(await service.getUserInfo('option', 'a')).toEqual(21);
    expect(await service.getUserInfo('login', 'a')).toEqual(3);
    // ???????????? ??????
    try {
      await service.getUserInfo('test', 'a');
    } catch (error) {
      expect(error.message).toEqual('??????????????? ?????????????????????');
    }
  });

  it('updateUserOptionInfo ?????????: ??????????????? ?????? repository??? option??? ????????? ??????????', async () => {
    const userId = 'example';
    const body = {
      nickname: 'user',
      profileImg: 'ImageUrl',
      bio: 'bio',
      preferPosition: 'support',
      tier: 1,
      enableChat: false,
      preferChamp1: '117',
      preferChamp2: '86',
      preferChamp3: null,
    };
    const preferChamp1 = 1;
    const preferChamp2 = 2;
    const preferChamp3 = 3;
    jest.spyOn(userRepository, 'findPreferchamps').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve({ preferChamp1, preferChamp2, preferChamp3 });
        }),
    );

    jest.spyOn(champRepository, 'delPreferChampCache').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );
    jest.spyOn(userRepository, 'updateUserOptionInfo').mockImplementation(
      (userId, body) =>
        new Promise((resolve) => {
          resolve();
        }),
    );
    // ???????????? ??????
    expect(await service.updateUserOptionInfo(userId, body)).toEqual({
      success: true,
      message: '?????? ?????? ?????????????????????',
    });
    // ???????????? ??????
    try {
      await service.updateUserOptionInfo(userId, body);
    } catch (error) {
      expect(error.message).toEqual('?????? ?????? ??????????????????');
    }
  });
});
