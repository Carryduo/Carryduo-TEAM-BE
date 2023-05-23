import { UserRepository } from 'src/user/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { createQueryBuilder } from 'typeorm';
import { ChampRepository } from 'src/champ/champ.repository';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { ChampSkillEntity } from 'src/champ/entities/champSkillInfo.entity';
import { CACHE_MANAGER } from '@nestjs/common';
import { UpdateChampRateEntity } from 'src/champ/entities/update.champ.rate.entity';
import { GameInfoEntity } from 'src/champ/entities/game.info.entity';
import {
  GetUserInfoRequestDto,
  UpdateUserOptionRequestBodyDto,
  UpdateUserOptionRequestDto,
} from '../dto/user.request.dto';

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
          provide: getRepositoryToken(GameInfoEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(UpdateChampRateEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ChampSkillEntity),
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

  it('getUserInfo 테스트: 카테고리에 따라 repository에 option을 다르게 주는가?', async () => {
    //  모킹방법은 이게 맞음.
    userRepository.getUserInfo = jest
      .fn()
      .mockImplementation((select: string[], userId: UserEntity) => {
        return { userId: select.length };
      });
    // 정상로직 확인
    const result = await service.getUserInfo(
      new GetUserInfoRequestDto('option', 'a'),
    );
    expect(result.userId).toEqual(21);
    const result_login = await service.getUserInfo(
      new GetUserInfoRequestDto('login', 'a'),
    );
    expect(result_login.userId).toEqual(3);
    // 예외처리 확인
    try {
      await service.getUserInfo(new GetUserInfoRequestDto('test', 'a'));
    } catch (error) {
      expect(error.message).toEqual('카테고리가 잘못되었습니다');
    }
  });

  it('updateUserOptionInfo 테스트', async () => {
    // 호출 여부로 테스트 검증하기

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
    const option = UpdateUserOptionRequestDto.createDto(userId, body);
    userRepository.findPreferchamps = jest.fn().mockImplementation(
      (
        userId: string,
      ): {
        preferChamp1: string;
        preferChamp2: string;
        preferChamp3: string;
      } => {
        return { preferChamp1: '1', preferChamp2: '2', preferChamp3: '3' };
      },
    );
    userRepository.updateUserOptionInfo = jest
      .fn()
      .mockImplementation((option) => {
        return option;
      });
    champRepository.delPreferChampCache = jest
      .fn()
      .mockImplementation((option) => {
        return option;
      });
    await service.updateUserOptionInfo(option);
    // 정상로직 확인
    expect(userRepository.findPreferchamps).toBeCalledWith(
      option.toEntity().userId,
    );
    expect(champRepository.delPreferChampCache).toBeCalledTimes(3);
    expect(userRepository.updateUserOptionInfo).toBeCalledWith(
      option.toEntity(),
    );
    // 예외처리 확인
    // try {
    //   await service.updateUserOptionInfo(option);
    // } catch (error) {
    //   expect(error.message).toEqual('설정 변경 실패했습니다');
    // }
  });
});
