import {
  UserBasicInfoResponseDTO,
  UserSpecificInfoResponseDTO,
} from 'src/user/dto/user.response.dto';
import { UserRepository } from './user.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { OptionRequestDTO } from './dto/user.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(
    category: string,
    data: AdminResponseDTO,
  ): Promise<UserBasicInfoResponseDTO | UserSpecificInfoResponseDTO> {
    const result = await this.userRepository.getUserInfo(data);
    const {
      id,
      nickname,
      tier,
      bio,
      profileImg,
      preferPosition,
      preferChamp1,
      preferChamp2,
      preferChamp3,
      enableChat,
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
        preferChamp1,
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
      await this.userRepository.updateUserOptionInfo(data, body);
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
    const result = await this.userRepository.getIndividualUserInfo(data);
    const {
      id,
      nickname,
      tier,
      bio,
      profileImg,
      preferPosition,
      preferChamp1,
      preferChamp2,
      preferChamp3,
      enableChat,
    } = result;

    return {
      userId: id,
      nickname,
      tier,
      bio,
      profileImg,
      preferPosition,
      preferChamp1,
      preferChamp2,
      preferChamp3,
      enableChat,
    };
  }
}
