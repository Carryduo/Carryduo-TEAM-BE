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
    const user = await this.usersRepository
      .createQueryBuilder()
      .select('USER')
      .from(UserEntity, 'USER')
      .where('USER.socialId = :socialId', { socialId })
      .andWhere('USER.social = :social', { social })
      .getOne();
    console.log(user);
    if (user === null) {
      let newUser;
      await this.usersRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await this.usersRepository
            .createQueryBuilder()
            .insert()
            .into(UserEntity)
            .values({
              ...data,
            })
            .execute();
          newUser = await transactionalEntityManager
            .createQueryBuilder()
            .select('USER')
            .from(UserEntity, 'USER')
            .where('USER.socialId = :socialId', { socialId })
            .andWhere('USER.social = :social', { social })
            .getOne();
        },
      );
      return newUser;
    }
    return user;
  }

  async findById(id: string) {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async deleteUser(id: string) {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('id = :id', { id })
      .execute();
    return { success: true, message: '회원 탈퇴 완료되었습니다' };
  }
}
