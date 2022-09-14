import { UserEntity } from './entities/user.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { adminResponse } from 'src/admin/dto/admin.response';
import { loginResponseDTO, optionResponseDTO } from './dto/user.response.dto';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async getUserInfo(
    category: string,
    data: adminResponse,
  ): Promise<loginResponseDTO | optionResponseDTO> {
    // TODO: findOne => queryBuilder로 수정(preferChamp 나오도록...)
    const result = await this.usersRepository.findOne({
      where: { id: data.userId },
    });
    console.log(result);
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
}
