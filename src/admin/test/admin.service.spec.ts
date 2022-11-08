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
  let jwtService: JwtService;
  let commentRepository: CommentRepository;
  let userRepository: UserRepository;
  let configService: ConfigService;
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
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
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

  it('kakaoLogin test: 카카오 로그인 시, 이미 가입 된 유저인 경우 id, nickname, token을 return하는가?', async () => {
    jest.spyOn(adminRepository, 'checkUser').mockImplementation(
      (data) =>
        new Promise((resolve) => {
          resolve({ userId: 'sampleId', nickname: data.nickname });
        }),
    );
    expect(await service.kakaoLogin(loginData)).toEqual(loginResult);
  });

  it('kakaoLogin test: 카카오 로그인 시, 신규 유저일 경우, 유저를 생성한 뒤 id, nickname, token을 return 하는가?', async () => {
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

  it('deleteUser 테스트: 정상작동 및 예외처리', async () => {
    const userId = '1';
    const commentIdList = [{ id: '1' }, { id: '2' }, { id: '3' }];
    jest.spyOn(adminRepository, 'findCommentList').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve(commentIdList);
        }),
    );
    // 챔피언 commment target
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

    // 소환사 comment target
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

    // user의 preferChamp 가져오기
    const preferChamp1 = 1;
    const preferChamp2 = 2;
    const preferChamp3 = 3;
    jest.spyOn(userRepository, 'findPreferchamps').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve({ preferChamp1, preferChamp2, preferChamp3 });
        }),
    );

    // user의 preferChamp 목록 캐싱 제거
    jest.spyOn(champRepository, 'delPreferChampCache').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // 유저 삭제
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // 유저가 등록한 캐싱 수정
    jest.spyOn(commentRepository, 'setCommentCache').mockImplementation(
      (category, target, option) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '회원 탈퇴 완료되었습니다',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('회원 탈퇴에 실패했습니다.');
    }
  });

  it('deleteUser 테스트: commentIdList length가 0인 경우 ', async () => {
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

    // user의 preferChamp 목록 캐싱 제거
    jest.spyOn(champRepository, 'delPreferChampCache').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // 유저 삭제
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // 유저가 등록한 캐싱 수정
    jest.spyOn(commentRepository, 'setCommentCache').mockImplementation(
      (category, target, option) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '회원 탈퇴 완료되었습니다',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('회원 탈퇴에 실패했습니다.');
    }
  });

  it('deleteUser 테스트: preferChampList의 length가 0인 경우 ', async () => {
    const userId = '1';
    const commentIdList = [{ id: '1' }, { id: '2' }, { id: '3' }];
    jest.spyOn(adminRepository, 'findCommentList').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve(commentIdList);
        }),
    );
    // 챔피언 commment target
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

    // 소환사 comment target
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

    // user의 preferChamp 가져오기
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

    // 유저 삭제
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    // 유저가 등록한 캐싱 수정
    jest.spyOn(commentRepository, 'setCommentCache').mockImplementation(
      (category, target, option) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '회원 탈퇴 완료되었습니다',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('회원 탈퇴에 실패했습니다.');
    }
  });

  it('deleteUser 테스트: commentIdList, preferChampList의 length가 0인 경우 ', async () => {
    const userId = '1';
    const commentIdList = [{ id: '1' }, { id: '2' }, { id: '3' }];
    jest.spyOn(adminRepository, 'findCommentList').mockImplementation(
      (userId) =>
        new Promise((resolve) => {
          resolve([]);
        }),
    );

    // user의 preferChamp 가져오기
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

    // 유저 삭제
    jest.spyOn(adminRepository, 'deleteUser').mockImplementation(
      (pcl) =>
        new Promise((resolve) => {
          resolve();
        }),
    );

    expect(await service.deleteUser(userId)).toEqual({
      success: true,
      message: '회원 탈퇴 완료되었습니다',
    });
    try {
      await service.deleteUser(userId);
    } catch (error) {
      expect(error.message).toEqual('회원 탈퇴에 실패했습니다.');
    }
  });
});
