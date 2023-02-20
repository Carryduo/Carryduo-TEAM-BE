import { UserRepository } from './user.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { GetUserInfoRequestDto, UpdateUserOptionRequestDto } from './dto/user.request.dto';
import { ChampRepository } from '../champ/champ.repository';
import { UserInfoResponseDto } from './dto/user.response.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly champRepository: ChampRepository) {}

  async getUserInfo(data: GetUserInfoRequestDto) {
    try {
      const selectOption = await this.userRepository.createSelectOption(data.category);
      const result = await this.userRepository.getUserInfo(selectOption, data.toEntity());
      return new UserInfoResponseDto(result);
    } catch (error) {
      throw new HttpException('카테고리가 잘못되었습니다', 400);
    }
  }

  async updateUserOptionInfo(data: UpdateUserOptionRequestDto) {
    try {
      const option = data.toEntity();
      const preferChamp = await this.userRepository.findPreferchamps(option.userId);
      console.log(preferChamp);
      const preferChampList = [preferChamp.preferChamp1, preferChamp.preferChamp2, preferChamp.preferChamp3];
      for (const pcl of preferChampList) {
        await this.champRepository.delPreferChampCache(pcl);
      }
      await this.userRepository.updateUserOptionInfo(option);
      return;
    } catch (error) {
      console.log(error);
      throw new HttpException('설정 변경 실패했습니다', 400);
    }
  }
}
