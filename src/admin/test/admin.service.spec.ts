import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { AdminRepository } from './../admin.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../admin.service';
import { ChampRepository } from 'src/champ/champ.repository';
import { JwtService } from '@nestjs/jwt';
import { CommentRepository } from 'src/comments/comments.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { ChampRateEntity } from 'src/champ/entities/champ.rate.entity';
import { ChampSkillInfoEntity } from 'src/champ/entities/champSkillInfo.entity';
import { ChampSpellEntity } from 'src/champ/entities/champ.spell';
import { CACHE_MANAGER } from '@nestjs/common';
import { CommentEntity } from 'src/comments/entities/comments.entity';

describe('AdminService', () => {
  const mockRepository = () => {
    createQueryBuilder: jest.fn();
  };
  class MockChache {}
  let service: AdminService;
  let adminRepository: AdminRepository;
  let champRepository: ChampRepository;
  let commentRepository: CommentRepository;
  let userRepository: UserRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AdminService>(AdminService);
    userRepository = module.get<UserRepository>(UserRepository);
    champRepository = module.get<ChampRepository>(ChampRepository);
    adminRepository = module.get<AdminRepository>(AdminRepository);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  const loginData = {
    socialId: '1',
    social: 'kakao',
    nickname: 'user1',
    profileImg: 'user1-profileImg',
  };
  const loginResult = {
    id: 'sampleId',
    nickname: 'user1',
    token: 'sample token',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('kakaoLogin test: ????????? ????????? ???, ?????? ?????? ??? ????????? ?????? id, nickname, token??? return??????????', async () => {
    jest.spyOn(adminRepository, 'checkUser').mockImplementation(
      (data) =>
        new Promise((resolve) => {
          resolve({ userId: 'sampleId', nickname: data.nickname });
        }),
    );
    expect(await service.kakaoLogin(loginData)).toEqual(loginResult);
  });

  it('kakaoLogin test: ????????? ????????? ???, ?????? ????????? ??????, ????????? ????????? ??? id, nickname, token??? return ??????????', async () => {
    jest.spyOn(adminRepository, 'checkUser').mockImplementation(
      (data) =>
        new Promise((resolve) => {
          resolve(null);
        }),
    );
    jest.spyOn(adminRepository, 'createUser').mockImplementation(
      (data) =>
        new Promise((resolve) => {
          resolve({ userId: 'sampleId', nickname: data.nickname });
        }),
    );
    expect(await service.kakaoLogin(loginData)).toEqual(loginResult);
  });

  it('deleteUser ?????????: ???????????? ??? ????????????', async () => {
    const userId = '1';
    const commentIdList = [{ id: '1' }, { id: '2' }, { id: '3' }];
    jest.spyOn(adminRepository, 'findCommentList').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve(commentIdList);
        }),
    );
    // ????????? commment target
    jest.spyOn(adminRepository, 'findCommentOptions').mockImplementation(
      (id) =>
        new Promise((resolve) => {
          resolve({
            category: '0',
            id,
            summonerName: null,
            champId: { id: `1${id}` },
          });
        }),
    );

    // ????????? comment target
    jest.spyOn(adminRepository, 'findCommentOptions').mockImplementation(
      (id) =>
        new Promise((resolve) => {
          resolve({
            category: '0',
            id,
            summonerName: { summonerName: `summoner${id}` },
            champId: null,
          });
        }),
    );

    // user??? preferChamp ????????????
    const preferChamp1 = 1;
    const preferChamp2 = 2;
    const preferChamp3 = 3;
    jest.spyOn(userRepository, 'findPreferchamps').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve({ preferChamp1, preferChamp2, preferChamp3 });
        }),
    );

    // user??? preferChamp ?????? ?????? ??????
    jest.spyOn(champRepository, 'delPreferChampCache').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // ?????? ??????
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // ????????? ????????? ?????? ??????
    jest.spyOn(commentRepository, 'setCommentCache').mockImplementation(
      (category, target, option) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '?????? ?????? ?????????????????????',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('?????? ????????? ??????????????????.');
    }
  });

  it('deleteUser ?????????: commentIdList length??? 0??? ?????? ', async () => {
    const userId = '1';
    const commentIdList = [{ id: '1' }, { id: '2' }, { id: '3' }];
    jest.spyOn(adminRepository, 'findCommentList').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve([]);
        }),
    );
    const preferChamp1 = 1;
    const preferChamp2 = 2;
    const preferChamp3 = 3;
    jest.spyOn(userRepository, 'findPreferchamps').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve({ preferChamp1, preferChamp2, preferChamp3 });
        }),
    );

    // user??? preferChamp ?????? ?????? ??????
    jest.spyOn(champRepository, 'delPreferChampCache').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // ?????? ??????
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // ????????? ????????? ?????? ??????
    jest.spyOn(commentRepository, 'setCommentCache').mockImplementation(
      (category, target, option) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '?????? ?????? ?????????????????????',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('?????? ????????? ??????????????????.');
    }
  });

  it('deleteUser ?????????: preferChampList??? length??? 0??? ?????? ', async () => {
    const userId = '1';
    const commentIdList = [{ id: '1' }, { id: '2' }, { id: '3' }];
    jest.spyOn(adminRepository, 'findCommentList').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve(commentIdList);
        }),
    );
    // ????????? commment target
    jest.spyOn(adminRepository, 'findCommentOptions').mockImplementation(
      (id) =>
        new Promise((resolve) => {
          resolve({
            category: '0',
            id,
            summonerName: null,
            champId: { id: `1${id}` },
          });
        }),
    );

    // ????????? comment target
    jest.spyOn(adminRepository, 'findCommentOptions').mockImplementation(
      (id) =>
        new Promise((resolve) => {
          resolve({
            category: '0',
            id,
            summonerName: { summonerName: `summoner${id}` },
            champId: null,
          });
        }),
    );

    // user??? preferChamp ????????????
    jest.spyOn(userRepository, 'findPreferchamps').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve({
            preferChamp1: null,
            preferChamp2: null,
            preferChamp3: null,
          });
        }),
    );

    // ?????? ??????
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // ????????? ????????? ?????? ??????
    jest.spyOn(commentRepository, 'setCommentCache').mockImplementation(
      (category, target, option) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '?????? ?????? ?????????????????????',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('?????? ????????? ??????????????????.');
    }
  });

  it('deleteUser ?????????: commentIdList, preferChampList??? length??? 0??? ?????? ', async () => {
    const userId = '1';
    const commentIdList = [{ id: '1' }, { id: '2' }, { id: '3' }];
    jest.spyOn(adminRepository, 'findCommentList').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve([]);
        }),
    );

    // user??? preferChamp ????????????
    jest.spyOn(userRepository, 'findPreferchamps').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve({
            preferChamp1: null,
            preferChamp2: null,
            preferChamp3: null,
          });
        }),
    );

    // ?????? ??????
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '?????? ?????? ?????????????????????',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('?????? ????????? ??????????????????.');
    }
  });
});
