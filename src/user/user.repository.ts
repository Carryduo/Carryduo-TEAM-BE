import { UserEntity } from './entities/user.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import {
  UserBasicInfoResponseDTO,
  UserSpecificInfoResponseDTO,
} from './dto/user.response.dto';
import { OptionRequestDTO } from './dto/user.request.dto';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async getUserInfo(
    category: string,
    data: AdminResponseDTO,
  ): Promise<UserBasicInfoResponseDTO | UserSpecificInfoResponseDTO> {
    // TODO: findOne => queryBuilder로 수정(preferChamp 나오도록...)
    const result = await this.usersRepository.findOne({
      where: { id: data.userId },
    });

    const {
      id,
      nickname,
      tier,
      bio,
      profileImg,
      preferPosition,
      enableChat,
      preferChamp1,
      preferChamp2,
      preferChamp3,
    } = result;

    if (category === 'login') {
      return {
        userId: id,
        nickname,
        profileImg,
      };
    } else if (category === 'option') {
      return {
        userId: id,
        nickname,
        tier,
        bio,
        profileImg,
        preferPosition,
        // TODO: 트랜젝션으로 묶기
        preferChamp1, // result.preferChamp1에는 champ table 정보가 있어서, 이에 대한 타입도 지정해줘야함.
        preferChamp2,
        preferChamp3,
        enableChat,
      };
    } else {
      throw new HttpException('카테고리가 잘못되었습니다', 400);
    }
  }
  async updateUserOptionInfo(data: AdminResponseDTO, body: OptionRequestDTO) {
    try {
      await this.usersRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set(body)
        .where('id = :id', { id: data.userId })
        .execute();
      return {
        success: true,
        message: '설정 변경 완료되었습니다',
      };
    } catch {
      throw new HttpException('설정 변경 실패했습니다', 400);
    }
  }

  async getIndividualUserInfo(
    data: string,
  ): Promise<UserSpecificInfoResponseDTO> {
    const result = await this.usersRepository.findOne({ where: { id: data } });
    const {
      id,
      nickname,
      tier,
      bio,
      profileImg,
      preferPosition,
      enableChat,
      preferChamp1,
      preferChamp2,
      preferChamp3,
    } = result;
    return {
      userId: id,
      nickname,
      tier,
      bio,
      profileImg,
      preferPosition,
      enableChat,
      preferChamp1, // result.preferChamp1에는 champ table 정보가 있어서, 이에 대한 타입도 지정해줘야함.
      preferChamp2,
      preferChamp3,
    };
  }
}
