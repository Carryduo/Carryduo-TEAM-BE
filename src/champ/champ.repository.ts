import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ChampEntity } from './entities/champ.entity';
import { ChampSpellEntity } from './entities/champ.spell';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';
import { Cache } from 'cache-manager';
import { ChampInfoEntity } from './entities/champ.info.entity';

export class ChampRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
    @InjectRepository(ChampInfoEntity)
    private readonly champInfoRepository: Repository<ChampInfoEntity>,
    @InjectRepository(ChampSkillInfoEntity)
    private readonly skillRepository: Repository<ChampSkillInfoEntity>,

    @InjectRepository(ChampSpellEntity)
    private readonly champSpellRepository: Repository<ChampSpellEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
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
      .select(['user.userId', 'user.nickname', 'user.profileImg', 'user.tier'])
      .getMany();
  }

  async delPreferChampCache(key: string) {
    await this.cacheManager.del(`/champ/${key}/users`);
  }

  async getChmapList() {
    return await this.champInfoRepository
      .createQueryBuilder()
      .select([
        'champId AS id',
        'champ_name_ko AS champNameKo ',
        'champ_name_en AS champNameEn',
        'champ_main_img AS champMainImg',
        'champ_img AS champImg',
      ])
      .orderBy('champ_name_ko', 'ASC')
      .getRawMany();
  }
  async getTargetChampion(champId: string) {
    return await this.champRepository
      .createQueryBuilder('champ')
      .leftJoinAndSelect('champ.champSkillInfo', 'skillInfo')
      .leftJoin('champ.champInfo', 'champInfo')
      .where('champ.champId=:chmapId', { chmapId: champId })
      .andWhere('version = :version', { version: 'old' })
      .orderBy('skillInfo.createdAt', 'ASC')
      .getOne();
  }

  async getChampSpell(champId: string) {
    return await this.champSpellRepository
      .createQueryBuilder('spell')
      .where('spell.champId = :champId', { champId })
      .orderBy('spell.pickRate', 'DESC')
      .limit(2)
      .execute();
  }
}
