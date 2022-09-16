import { UserEntity } from './entities/user.entity';
import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { adminResponse } from 'src/admin/dto/admin.response';
import { loginResponseDTO, optionResponseDTO } from './dto/user.response.dto';
import { OptionRequestDTO } from './dto/user.request.dto';
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
    const result = await this.usersRepository
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .where('user.id = :id', { id: data.userId })
      .getOne();
    const result2 = await this.usersRepository.find({
      relations: ['preferChamp1'],
    });
    console.log(result2);
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
  async updateUserOptionInfo(data: adminResponse, body: OptionRequestDTO) {
    try {
      console.log(data);
      console.log(body);
      const result = await this.usersRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set(body)
        .where('id = :id', { id: data.userId })
        .execute();
      console.log(result);
      return {
        success: true,
        message: '설정 변경 완료되었습니다',
      };
    } catch {
      throw new HttpException('설정 변경 실패했습니다', 400);
    }
  }
}
