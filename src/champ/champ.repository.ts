import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ChampEntity } from './entities/champ.entity';
import { ChampSpellEntity } from './entities/champ.spell';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';
import { Cache } from 'cache-manager';
import { ChampRateEntity } from './entities/champ.rate.entity';
import { preferChampUsersDTO } from './dto/prefer-champ/prefer.champ.dto';
import { ChampSpellCommonDTO } from './dto/champ-spell/champ.spell.common.dto';

export class ChampRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
    @InjectRepository(ChampSpellEntity)
    private readonly champSpellRepository: Repository<ChampSpellEntity>,
    @InjectRepository(ChampRateEntity)
    private readonly champRateRepository: Repository<ChampRateEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async existChamp(champId) {
    return await this.champRepository.createQueryBuilder().where('champId = :champId', { champId }).getOne();
  }

  async findPreferChampUsers(champId: string): Promise<preferChampUsersDTO[] | []> {
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

  async getChampList() {
    return await this.champRepository.createQueryBuilder().select(['champId AS id', 'champ_name_ko AS champNameKo ', 'champ_name_en AS champNameEn', 'champ_main_img AS champMainImg', 'champ_img AS champImg']).orderBy('champ_name_ko', 'ASC').getRawMany();
  }

  async rateVersion() {
    return await this.champRateRepository.createQueryBuilder('rate').select('DISTINCT rate.version').where('rate.version <> :version', { version: 'old' }).getRawMany();
  }

  async getTargetChampion(champId: string, version: string) {
    try {
      return await this.champRepository
        .createQueryBuilder('champ')
        .leftJoinAndSelect('champ.champSkillInfo', 'skill')
        .leftJoinAndSelect('champ.champRate', 'rate')
        .select(['champ.id', 'champ.champNameKo', 'champ.champNameEn', 'champ.champMainImg', 'skill.skillId', 'skill.skillName', 'skill.skillDesc', 'skill.skillToolTip', 'skill.skillImg', 'rate.winRate', 'rate.banRate', 'rate.pickRate', 'rate.topRate', 'rate.jungleRate', 'rate.midRate', 'rate.adRate', 'rate.supportRate', 'rate.version'])
        .where('champ.id = :champId', { champId })
        .andWhere('rate.version = :version', { version })
        .orderBy('skill.createdAt', 'ASC')
        .getOne();
    } catch (err) {
      console.log(err);
    }
  }

  async spellVersion() {
    return await this.champSpellRepository.createQueryBuilder('spell').select('DISTINCT spell.version').where('spell.version <> :version', { version: 'old' }).getRawMany();
  }

  async getChampSpell(champId: string, version: string) {
    return await this.champSpellRepository.createQueryBuilder('spell').where('spell.champId = :champId', { champId }).andWhere('spell.version = :version', { version }).select(['spell.spell1', 'spell.spell2', 'spell.pickRate', 'spell.version', 'spell.champId']).addSelect('SUM(spell.sample_num) OVER(PARTITION BY spell.champID) total').orderBy('spell.sample_num', 'DESC').limit(1).execute();
  }
}
