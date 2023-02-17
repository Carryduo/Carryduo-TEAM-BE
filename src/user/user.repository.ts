import { UserEntity } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}
  async getUserInfo(select: string[], where: UserEntity): Promise<UserEntity> {
    return await this.usersRepository.createQueryBuilder('user').leftJoinAndSelect('user.preferChamp1', 'preferChamp1').leftJoinAndSelect('user.preferChamp2', 'preferChamp2').leftJoinAndSelect('user.preferChamp3', 'preferChamp3').select(select).where('user.userId = :userId', where).getOne();
  }

  async updateUserOptionInfo(option: UserEntity) {
    const { userId, nickname, profileImg, bio, preferPosition, enableChat, preferChamp1, preferChamp2, preferChamp3, tier } = option;

    await this.usersRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        nickname,
        profileImg,
        bio,
        tier,
        preferPosition,
        enableChat,
        preferChamp1,
        preferChamp2,
        preferChamp3,
        // preferChamp1: () => String(preferChamp1),
        // preferChamp2: () => String(preferChamp2),
        // preferChamp3: () => String(preferChamp3),
      })
      .where('userId = :userId', { userId })
      .execute();
    return;
  }

  async findPreferchamps(userId: string): Promise<UserEntity> {
    return await this.usersRepository.createQueryBuilder('user').select(['user.preferChamp1', 'user.preferChamp2', 'user.preferChamp3']).where('user.userId = :userId', { userId }).getRawOne();
  }

  createSelectOption(category: string, userId: string): { select: string[]; where: UserEntity } {
    let select: string[];
    if (category === 'login') {
      select = ['user.userId', 'user.nickname', 'user.profileImg'];
    } else if (category === 'option' || category === 'individual') {
      select = ['user.userId', 'user.nickname', 'user.tier', 'user.bio', 'user.profileImg', 'user.preferPosition', 'user.preferChamp1', 'preferChamp1.id', 'preferChamp1.champNameKo', 'preferChamp1.champNameEn', 'preferChamp1.champImg', 'user.preferChamp2', 'preferChamp2.id', 'preferChamp2.champNameKo', 'preferChamp2.champNameEn', 'preferChamp2.champImg', 'user.preferChamp3', 'preferChamp3.id', 'preferChamp3.champNameKo', 'preferChamp3.champNameEn', 'preferChamp3.champImg'];
    }
    return { select, where: UserEntity.createSelectOption(userId) };
  }
}
