import { UserEntity } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OptionRequestDTO } from './dto/user.request.dto';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async getUserInfo(option, userId: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.preferChamp1', 'preferChamp1')
      .leftJoinAndSelect('user.preferChamp2', 'preferChamp2')
      .leftJoinAndSelect('user.preferChamp3', 'preferChamp3')
      .select(option)
      .where('user.userId = :userId', { userId })
      .getOne();
  }

  async updateUserOptionInfo(userId: string, body: OptionRequestDTO) {
    const {
      nickname,
      profileImg,
      bio,
      preferPosition,
      enableChat,
      preferChamp1,
      preferChamp2,
      preferChamp3,
      tier,
    } = body;

    return await this.usersRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        nickname,
        profileImg,
        bio,
        tier,
        preferPosition,
        enableChat,
        preferChamp1: () => String(preferChamp1),
        preferChamp2: () => String(preferChamp2),
        preferChamp3: () => String(preferChamp3),
      })
      .where('userId = :userId', { userId })
      .execute();
  }

  async findPreferchamps(userId) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.preferChamp1', 'user.preferChamp2', 'user.preferChamp3'])
      .where('user.userId = :userId', { userId })
      .getRawOne();
  }
}
