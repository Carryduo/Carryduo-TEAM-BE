import { HttpStatus } from '@nestjs/common';
import { BadRequestException, HttpException } from '@nestjs/common/exceptions';
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

  async getChmapList() {
    return await this.champsRepository.find({
      order: { champNameKo: 'ASC' },
    });
  }

  async getTargetChampion(champId: string) {
    let skill = [];

    // TODO: DB에러 발생 시, httpException filter로 넘어가게 해야함
    const champInfo = await this.champsRepository
      .createQueryBuilder('champ')
      .leftJoinAndSelect('champ.champSkillInfo', 'skillInfo')
      .where('champ.chmapId=:chmapId', { chmapId: champId })
      .orderBy('skillInfo.createdAt', 'ASC')
      .getOne();

    if (!champInfo) {
      throw new HttpException(
        '해당하는 챔피언 정보가 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    champInfo.champSkillInfo.map((value) => {
      skill.push({
        id: value.skillId,
        name: value.skillName,
        desc: value.sikllDesc,
        toolTip: value.skillToolTip,
        image: value.skillImg,
      });
    });

    const data = {
      id: champInfo.id,
      champNameKo: champInfo.champNameKo,
      champNameEn: champInfo.champNameEn,
      champImg: champInfo.champImg,
      skill,
    };
    return data;
  }

  /** 라이엇 api repository
   * 다른 파일로 옮길 예정
   */
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

    await this.champsRepository.save({ ...data });
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

    await this.champsSkillInfoRepository
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

    await this.champsSkillInfoRepository
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

    await this.champsSkillInfoRepository
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

    await this.champsSkillInfoRepository
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

    await this.champsSkillInfoRepository
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
}
