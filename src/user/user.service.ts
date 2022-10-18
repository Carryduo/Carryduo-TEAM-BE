import {
  UserBasicInfoResponseDTO,
  UserSpecificInfoResponseDTO,
} from 'src/user/dto/user.response.dto';
import { UserRepository } from './user.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { OptionRequestDTO } from './dto/user.request.dto';
import { ChampRepository } from 'src/champ/champ.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly champRepository: ChampRepository,
  ) {}

  async getUserInfo(
    category: string,
    data: AdminResponseDTO,
  ): Promise<UserBasicInfoResponseDTO | UserSpecificInfoResponseDTO> {
    const result = await this.userRepository.getUserInfo(data);
    const {
      userId,
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
        userId,
        nickname,
        profileImg,
      };
    } else if (category === 'option') {
      return {
        userId,
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

      const preferChampList = [
        body.preferChamp1,
        body.preferChamp2,
        body.preferChamp3,
      ];

      for (const pcl of preferChampList) {
        await this.champRepository.delPreferChampCache(pcl);
      }

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
      userId,
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
      userId,
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
