import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ChampEntity } from './entities/champ.entity';

export class ChampRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findPreferChampUsers(champId: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where(
        new Brackets((qb) => {
          qb.where('user.preferChamp1 = :preferChamp1', {
            preferChamp1: champId,
          })
            .orWhere('user.preferChamp2 = :preferChamp2', {
              preferChamp2: champId,
            })
            .orWhere('user.preferChamp3 = :preferChamp3', {
              preferChamp3: champId,
            });
        }),
      )
      .orderBy('user.tier', 'DESC')
      .select(['user.id', 'user.nickname', 'user.profileImg', 'user.tier'])
      .getMany();
  }

  async getChmapList() {
    return await this.champRepository.find({
      order: { champNameKo: 'ASC' },
    });
  }

  async getTargetChampion(champId: string) {
    return await this.champRepository
      .createQueryBuilder('champ')
      .leftJoinAndSelect('champ.champSkillInfo', 'skillInfo')
      .where('champ.chmapId=:chmapId', { chmapId: champId })
      .orderBy('skillInfo.createdAt', 'ASC')
      .getOne();
  }
}
