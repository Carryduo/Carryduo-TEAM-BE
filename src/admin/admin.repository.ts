import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { kakaoPayload } from './dto/kakao.payload';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async checkAndSignUser(data: kakaoPayload) {
    const { socialId, social } = data;
    const user = await this.usersRepository.findOne({
      where: { social, socialId },
    });
    if (user === null) {
      console.log(data.socialId);
      const newUser = await this.usersRepository.save({
        ...data,
      });
      return newUser;
    }
    return user;
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async deleteUser(id: string) {
    console.log(id);
    this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('id = :id', { id })
      .execute();
    return { success: true };
  }
}
