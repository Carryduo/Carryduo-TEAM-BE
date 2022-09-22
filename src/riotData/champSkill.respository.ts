import { ChampSkillInfoEntity } from 'src/champ/entities/champSkillInfo.entity';

async function targetChampionSkillInfoSave(
  championId: string,
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

  await this.champSkillInfoRepository
    .createQueryBuilder()
    .insert()
    .into(ChampSkillInfoEntity)
    .values({
      champId: { id: championId },
      skillId: qSkill.id,
      skillName: qSkill.name,
      sikllDesc: qSkill.desc,
      skillToolTip: qSkill.tooltip,
      skillImg: qSkill.image,
    })
    .execute();

  await this.champSkillInfoRepository
    .createQueryBuilder()
    .insert()
    .into(ChampSkillInfoEntity)
    .values({
      champId: { id: championId },
      skillId: wSkill.id,
      skillName: wSkill.name,
      sikllDesc: wSkill.desc,
      skillToolTip: wSkill.tooltip,
      skillImg: wSkill.image,
    })
    .execute();

  await this.champSkillInfoRepository
    .createQueryBuilder()
    .insert()
    .into(ChampSkillInfoEntity)
    .values({
      champId: { id: championId },
      skillId: eSkill.id,
      skillName: eSkill.name,
      sikllDesc: eSkill.desc,
      skillToolTip: eSkill.tooltip,
      skillImg: eSkill.image,
    })
    .execute();

  await this.champSkillInfoRepository
    .createQueryBuilder()
    .insert()
    .into(ChampSkillInfoEntity)
    .values({
      champId: { id: championId },
      skillId: rSkill.id,
      skillName: rSkill.name,
      sikllDesc: rSkill.desc,
      skillToolTip: rSkill.tooltip,
      skillImg: rSkill.image,
    })
    .execute();

  await this.champSkillInfoRepository
    .createQueryBuilder()
    .insert()
    .into(ChampSkillInfoEntity)
    .values({
      champId: { id: championId },
      skillId: passive.id,
      skillName: passive.name,
      sikllDesc: passive.desc,
      skillImg: passive.image,
    })
    .execute();
}
