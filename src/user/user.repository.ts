import { UserEntity } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';

import { OptionRequestDTO } from './dto/user.request.dto';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async getUserInfo(data: AdminResponseDTO) {
    return await this.usersRepository.findOne({
      select: [
        'bio',
        'userId',
        'nickname',
        'enableChat',
        'preferPosition',
        'preferChamp1',
        'preferChamp2',
        'preferChamp3',
        'tier',
        'profileImg',
      ],
      where: { userId: data.userId },
    });
  }

  async updateUserOptionInfo(data: AdminResponseDTO, body: OptionRequestDTO) {
    return await this.usersRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set(body)
      .where('userId = :userId', { userId: data.userId })
      .execute();
  }

  async getIndividualUserInfo(userId: string) {
    return await this.usersRepository.findOne({
      where: { userId },
      select: [
        'bio',
        'userId',
        'nickname',
        'enableChat',
        'preferPosition',
        'preferChamp1',
        'preferChamp2',
        'preferChamp3',
        'tier',
        'profileImg',
      ],
    });
  }
}
