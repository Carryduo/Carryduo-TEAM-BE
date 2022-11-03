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
});
