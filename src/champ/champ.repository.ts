import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import {
  champDataDTO,
  champPassiveSkillDTO,
  champSkillDTO,
} from './dto/champ/champ.dto';
import { ChampEntity } from './entities/champ.entity';
import { ChampSpellEntity } from './entities/champ.spell';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';

export class ChampRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
    @InjectRepository(ChampSkillInfoEntity)
    private readonly skillRepository: Repository<ChampSkillInfoEntity>,

    @InjectRepository(ChampSpellEntity)
    private readonly champSpellRepository: Repository<ChampSpellEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // @InjectRedis() private readonly redis: Redis,
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
      .where('champ.champId=:chmapId', { chmapId: champId })
      .orderBy('skillInfo.createdAt', 'ASC')
      .getOne();
  }

  async getChampSpell(champId) {
    return await this.champSpellRepository
      .createQueryBuilder('spell')
      .where('spell.champId = :champId', { champId })
      .orderBy('spell.pickRate', 'DESC')
      .limit(2)
      .execute();
  }

  //--------------------------------------------------------------------------------------------

  async targetChampionInfoSave(data: champDataDTO) {
    return this.champRepository
      .createQueryBuilder()
      .insert()
      .into(ChampEntity)
      .values({
        id: data.championId,
        champNameEn: data.championNameEn,
        champNameKo: data.championNameKo,
        champMainImg: data.championMainImg,
        champImg: data.championImg,
      })
      .execute();
  }

  async targetChampionSkillInfoSave(
    championId: string,
    qSkillInfo: champSkillDTO,
    wSkillInfo: champSkillDTO,
    eSkillInfo: champSkillDTO,
    rSkillInfo: champSkillDTO,
    passiveInfo: champPassiveSkillDTO,
  ) {
    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: () => {
          return championId;
        },
        skillId: qSkillInfo.id,
        skillName: qSkillInfo.name,
        skillDesc: qSkillInfo.desc,
        skillToolTip: qSkillInfo.tooltip,
        skillImg: qSkillInfo.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: () => {
          return championId;
        },
        skillId: wSkillInfo.id,
        skillName: wSkillInfo.name,
        skillDesc: wSkillInfo.desc,
        skillToolTip: wSkillInfo.tooltip,
        skillImg: wSkillInfo.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: () => {
          return championId;
        },
        skillId: eSkillInfo.id,
        skillName: eSkillInfo.name,
        skillDesc: eSkillInfo.desc,
        skillToolTip: eSkillInfo.tooltip,
        skillImg: eSkillInfo.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: () => {
          return championId;
        },
        skillId: rSkillInfo.id,
        skillName: rSkillInfo.name,
        skillDesc: rSkillInfo.desc,
        skillToolTip: rSkillInfo.tooltip,
        skillImg: rSkillInfo.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: () => {
          return championId;
        },
        skillId: passiveInfo.id,
        skillName: passiveInfo.name,
        skillDesc: passiveInfo.desc,
        skillImg: passiveInfo.image,
      })
      .execute();
  }

  async getTooltip() {
    return await this.skillRepository
      .createQueryBuilder('CHAMPSKILLINFO')
      .leftJoinAndSelect('CHAMPSKILLINFO.champId', 'champ')
      .select()
      .getMany();
  }

  async editToolTip(id, skillToolTip, skillDesc) {
    try {
      await this.skillRepository
        .createQueryBuilder('CHAMPSKILLINFO')
        .update()
        .set({ skillToolTip, skillDesc })
        .where('CHAMPSKILLINFO.id = :id', { id })
        .execute();
      return 'success';
    } catch (error) {
      console.log(error);
      return 'fail';
    }
  }
}
