import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { ChampEntity } from './entities/champ.entity';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';

export class ChampRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
    @InjectRepository(ChampSkillInfoEntity)
    private readonly skillRepository: Repository<ChampSkillInfoEntity>,
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

  //--------------------------------------------------------------------------------------------

  async targetChampionInfoSave(
    champId: number,
    champNameEn: string,
    champNameKo: string,
    champImg: string,
  ) {
    console.log(champId);
    return this.champRepository
      .createQueryBuilder()
      .insert()
      .into(ChampEntity)
      .values({ id: champId, champNameKo, champNameEn, champImg })
      .execute();
  }

  async targetChampionSkillInfoSave(
    championId: number,
    qSkillInfo: object,
    wSkillInfo: object,
    eSkillInfo: object,
    rSkillInfo: object,
    passiveInfo: object,
  ) {
    let qSkill: any = {};
    let wSkill: any = {};
    let eSkill: any = {};
    let rSkill: any = {};
    let passive: any = {};

    qSkill = Object.assign({}, qSkillInfo);
    wSkill = Object.assign({}, wSkillInfo);
    eSkill = Object.assign({}, eSkillInfo);
    rSkill = Object.assign({}, rSkillInfo);
    passive = Object.assign({}, passiveInfo);

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: championId,
        skillId: qSkill.id,
        skillName: qSkill.name,
        sikllDesc: qSkill.desc,
        skillToolTip: qSkill.tooltip,
        skillImg: qSkill.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: championId,
        skillId: wSkill.id,
        skillName: wSkill.name,
        sikllDesc: wSkill.desc,
        skillToolTip: wSkill.tooltip,
        skillImg: wSkill.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: championId,
        skillId: eSkill.id,
        skillName: eSkill.name,
        sikllDesc: eSkill.desc,
        skillToolTip: eSkill.tooltip,
        skillImg: eSkill.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: championId,
        skillId: rSkill.id,
        skillName: rSkill.name,
        sikllDesc: rSkill.desc,
        skillToolTip: rSkill.tooltip,
        skillImg: rSkill.image,
      })
      .execute();

    await this.skillRepository
      .createQueryBuilder()
      .insert()
      .into(ChampSkillInfoEntity)
      .values({
        champId: championId,
        skillId: passive.id,
        skillName: passive.name,
        sikllDesc: passive.desc,
        skillImg: passive.image,
      })
      .execute();
  }
}
