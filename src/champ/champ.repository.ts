import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ChampEntity } from './entities/champ.entity';
import { Cache } from 'cache-manager';
import { UpdateChampRateEntity } from './entities/update.champ.rate.entity';
import { GameInfoEntity } from './entities/game.info.entity';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { SkillSet } from './dto/champ-skill/champ.skill.common.dto';
import { plainToInstance } from 'class-transformer';
import { GetMostPositionDto } from './dto/champ-position/champ.most.position.dto';
import { GetChampRateDto } from './dto/champ-rate/champ.rate.dto';

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

  async getChampList(): Promise<ChampEntity[]> {
    return await this.champRepository.createQueryBuilder().orderBy('champ_name_ko', 'ASC').getMany();
  }

  async findPreferChampUsers(champId: string): Promise<UserEntity[] | []> {
    return await this.userRepository
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

  async delPreferChampCache(key: ChampEntity) {
    await this.cacheManager.del(`/champ/${key}/users`);
  }

  async existChamp(champId: string): Promise<ChampEntity> {
    return await this.champRepository.createQueryBuilder().where('champId = :champId', { champId }).getOne();
  }

  async rateVersion(): Promise<Array<{ version: string }>> {
    return await this.champRateRepository.createQueryBuilder('rate').select('DISTINCT rate.version').where('rate.version <> :version', { version: 'old' }).getRawMany();
  }

  async getMostPosition(champId: string, version: string): Promise<GetMostPositionDto[]> {
    return await this.champRateRepository.createQueryBuilder().where('champId = :champId', { champId }).andWhere('version = :version', { version }).select('position').orderBy('pick_count', 'DESC').limit(1).execute();
  }

  async getGameTotalCount(version: string): Promise<{ gameCount: string }> {
    return await this.gameDataRepository.createQueryBuilder().select('game_count gameCount').where('version = :version', { version }).getRawOne();
  }

  async getSkillData(champId: string): Promise<SkillSet[]> {
    return await this.champRepository.createQueryBuilder('champ').leftJoinAndSelect('champ.champSkillInfo', 'skill').select(['skill.skillId skillId', 'skill.skillName skillName', 'skill.skillDesc skillDesc', 'skill.skillToolTip skillToolTip', 'skill.skillImg skillImg']).where('champ.champId = :champId', { champId }).orderBy('skill.createdAt', 'ASC').getRawMany();
  }

  async getChampDefaultData(champId: string): Promise<ChampCommonDTO> {
    return await this.champRepository.createQueryBuilder('champ').where('champId = :champId', { champId }).select(['champ.id id', 'champ.champNameKo champNameKo', 'champ.champNameEn champNameEn', 'champ.champMainImg champImg']).getRawOne();
  }

  async getChampRate(champId: string, position: string, version: string): Promise<GetChampRateDto[]> {
    try {
      const { gameCount } = await this.getGameTotalCount(version);

      return await this.champRepository
        .createQueryBuilder('champ')
        .leftJoinAndSelect('champ.champ_rate', 'rate')
        .leftJoinAndSelect('champ.champ_spell', 'spell')
        .select('(rate.win/rate.pick_count)*100 winRate')
        .addSelect(`(rate.pick_count / ${gameCount})*100 pickRate`)
        .addSelect(['spell.spell1 spell1', 'spell.spell2 spell2', 'rate.version version'])
        .where('champ.champId = :champId', { champId })
        .andWhere('rate.version = :version', { version })
        .andWhere('rate.position = :position', { position })
        .andWhere('spell.version = :version', { version })
        .andWhere('spell.position = :position', { position })
        .orderBy('spell.playCount', 'DESC')
        .limit(1)
        .execute();
    } catch (err) {
      console.log(err);
    }
  }

  async getBanRate(champId: string, version: string): Promise<{ banRate: string }> {
    const { gameCount } = await this.getGameTotalCount(version);

    return await this.champRepository.createQueryBuilder('champ').leftJoinAndSelect('champ.champ_ban', 'ban').select(`ban.ban_count / ${gameCount}*100 banRate`).where('champ.champId = :champId', { champId }).andWhere('ban.version = :version', { version }).getRawOne();
  }
}
