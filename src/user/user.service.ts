import { UserRepository } from './user.repository';
import { HttpException, Injectable } from '@nestjs/common';
import { OptionRequestDTO } from './dto/user.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(category: string, userId: string) {
    try {
      let option;
      if (category === 'login') {
        option = ['user.userId', 'user.nickname', 'user.profileImg'];
      } else if (category === 'option' || category === 'individual') {
        option = [
          'user.userId',
          'user.nickname',
          'user.tier',
          'user.bio',
          'user.profileImg',
          'user.preferPosition',
          'user.preferChamp1',
          'preferChamp1.id',
          'preferChamp1.champNameKo',
          'preferChamp1.champNameEn',
          'preferChamp1.champImg',
          'user.preferChamp2',
          'preferChamp2.id',
          'preferChamp2.champNameKo',
          'preferChamp2.champNameEn',
          'preferChamp2.champImg',
          'user.preferChamp3',
          'preferChamp3.id',
          'preferChamp3.champNameKo',
          'preferChamp3.champNameEn',
          'preferChamp3.champImg',
        ];
      }
      const result = await this.userRepository.getUserInfo(option, userId);
      return result;
    } catch (error) {
      throw new HttpException('카테고리가 잘못되었습니다', 400);
    }
  }

  async updateUserOptionInfo(userId: string, body: OptionRequestDTO) {
    try {
      await this.userRepository.updateUserOptionInfo(userId, body);
      return {
        success: true,
        message: '설정 변경 완료되었습니다',
      };
    } catch {
      throw new HttpException('설정 변경 실패했습니다', 400);
    }
  }
}
