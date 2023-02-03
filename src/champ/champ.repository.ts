import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ChampEntity } from './entities/champ.entity';
import { Cache } from 'cache-manager';
import { preferChampUsersDTO } from './dto/prefer-champ/prefer.champ.dto';
import { UpdateChampRateEntity } from './entities/update.champ.rate.entity';
import { GameInfoEntity } from './entities/game.info.entity';

export class ChampRepository {
  constructor(
    @InjectRepository(GameInfoEntity)
    private readonly gameDataRepository: Repository<GameInfoEntity>,
    @InjectRepository(UpdateChampRateEntity)
    private readonly champRateRepository: Repository<UpdateChampRateEntity>,
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
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

  async getMostPosition(champId: string, version: string) {
    return await this.champRateRepository.createQueryBuilder().where('champId = :champId', { champId }).andWhere('version = :version', { version }).select('position').orderBy('pick_count', 'DESC').limit(1).execute();
  }
  async getGameTotalCount(version: string) {
    return await this.gameDataRepository.createQueryBuilder().select('game_count').where('version = :version', { version }).getRawOne();
  }

  async getChampData(champId: string, position: string, version: string) {
    try {
      const { game_count } = await this.getGameTotalCount(version);

      const skillInfo = await this.champRepository.createQueryBuilder('champ').leftJoinAndSelect('champ.champSkillInfo', 'skill').select(['skill.skillId id', 'skill.skillName name', 'skill.skillDesc skillDesc', 'skill.skillToolTip toolTip', 'skill.skillImg image']).where('champ.champId = :champId', { champId }).orderBy('skill.createdAt', 'ASC').getRawMany();

      const champDefaultData = await this.champRepository.createQueryBuilder('champ').where('champId = :champId', { champId }).select(['champ.id id', 'champ.champNameKo champNameKo', 'champ.champNameEn champNameEn', 'champ.champMainImg champImg']).getRawOne();

      const champInfo = await this.champRepository
        .createQueryBuilder('champ')
        .leftJoinAndSelect('champ.champ_rate', 'rate')
        .leftJoinAndSelect('champ.champ_spell', 'spell')
        .select('(rate.win/rate.pick_count)*100 winRate')
        .addSelect(`(rate.pick_count / ${game_count})*100 pickRate`)
        .addSelect(['spell.spell1 spell1', 'spell.spell2 spell2', 'rate.version version', 'rate.position position'])
        .where('champ.champId = :champId', { champId })
        .andWhere('rate.version = :version', { version })
        .andWhere('rate.position = :position', { position })
        .andWhere('spell.version = :version', { version })
        .andWhere('spell.position = :position', { position })
        .orderBy('spell.playCount', 'DESC')
        .limit(1)
        .execute();
      return { champDefaultData, skillInfo, champInfo };
    } catch (err) {
      console.log(err);
    }
  }
  async getBanRate(champId: string, version: string) {
    const { game_count } = await this.getGameTotalCount(version);

    return await this.champRepository.createQueryBuilder('champ').leftJoinAndSelect('champ.champ_ban', 'ban').select(`ban.ban_count / ${game_count}*100 banCount`).where('champ.champId = :champId', { champId }).andWhere('ban.version = :version', { version }).getRawOne();
  }
}
