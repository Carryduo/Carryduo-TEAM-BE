import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChampEntity } from './entities/champ.entity';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';

export class ChampRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champsRepository: Repository<ChampEntity>,
    @InjectRepository(ChampSkillInfoEntity)
    private readonly champsSkillInfoRepository: Repository<ChampSkillInfoEntity>,
  ) {}

  async champExistFilter(champId) {
    const existChamp = await this.champsRepository.find({
      where: { id: champId },
    });
    return existChamp;
  }

  async targetChampionInfoSave(
    championId: string,
    championNameEn: string,
    championNameKo: string,
    championImg: string,
  ) {
    const data = {
      id: championId,
      champNameEn: championNameEn,
      champNameKo: championNameKo,
      champImg: championImg,
    };

    const existChamp = await this.champExistFilter(data.id);

    if (existChamp.length === 0) await this.champsRepository.save({ ...data });
  }

  async targetChampionSkillInfoSave(
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

    const ChampInfo = await this.champExistFilter(championId);
    if (ChampInfo.length === 0) {
      await this.champsSkillInfoRepository.save({
        id: championId,
        skillId: qSkill.id,
        skillName: qSkill.name,
        sikllDesc: qSkill.desc,
        skillToolTip: qSkill.tooltip,
        skillImg: qSkill.image,
      });
      await this.champsSkillInfoRepository.save({
        id: championId,
        skillId: wSkill.id,
        skillName: wSkill.name,
        sikllDesc: wSkill.desc,
        skillToolTip: wSkill.tooltip,
        skillImg: wSkill.image,
      });
      await this.champsSkillInfoRepository.save({
        id: championId,
        skillId: eSkill.id,
        skillName: eSkill.name,
        sikllDesc: eSkill.desc,
        skillToolTip: eSkill.tooltip,
        skillImg: eSkill.image,
      });
      await this.champsSkillInfoRepository.save({
        id: championId,
        skillId: rSkill.id,
        skillName: rSkill.name,
        sikllDesc: rSkill.desc,
        skillToolTip: rSkill.tooltip,
        skillImg: rSkill.image,
      });
      await this.champsSkillInfoRepository.save({
        id: championId,
        skillId: passive.id,
        skillName: passive.name,
        sikllDesc: passive.desc,
        skillImg: passive.image,
      });
    }
  }
}
