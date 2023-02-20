import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampRateDataDto, GetChampRate } from './dto/champ-rate/champ.rate.dto';
import { ChampSkillCommonDTO, SkillSet } from './dto/champ-skill/champ.skill.common.dto';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { PreferChampUsersResDTO } from './dto/prefer-champ/prefer.champ.users.dto';
import { TargetChampionResDto } from './dto/target-champion/target.response.dto';
import { ChampEntity } from './entities/champ.entity';

@Injectable()
export class champDtoFactory {
  constructor() {}
  async createChampList(champArray: ChampEntity[]) {
    return champArray.map((v) => plainToInstance(ChampCommonDTO, v));
  }
  async createPreferChampUserList(user: UserEntity[]) {
    return user.map((v) => plainToInstance(PreferChampUsersResDTO, v));
  }

  async createChampData(champData: ChampCommonDTO) {
    return plainToInstance(ChampCommonDTO, champData);
  }

  async createChampRate(champRate: GetChampRate[], banRate: string | number, position: string) {
    const spellInfo = {
      21: 'SummonerBarrier',
      1: 'SummonerBoost',
      14: 'SummonerDot',
      3: 'SummonerExhaust',
      4: 'SummonerFlash',
      6: 'SummonerHaste',
      7: 'SummonerHeal',
      13: 'SummonerMana',
      11: 'SummonerSmite',
      12: 'SummonerTeleport',
    };

    let rate: GetChampRate;
    let spell1Img: string;
    let spell2Img: string;
    if (champRate.length === 0) {
      rate = new GetChampRate(null);
    } else {
      rate = new GetChampRate(champRate[0]);
    }
    const { spell1, spell2, version, ...withoutSpell } = rate;
    if (spell1 === 0 && spell2 === 0) {
      spell1Img = `${process.env.S3_ORIGIN_URL}/default/default_0.png`;
      spell2Img = `${process.env.S3_ORIGIN_URL}/default/default_0.png`;
    } else {
      spell1Img = `${process.env.S3_ORIGIN_URL}/spell/${spellInfo[spell1]}.png`;
      spell2Img = `${process.env.S3_ORIGIN_URL}/spell/${spellInfo[spell2]}.png`;
    }

    banRate = !banRate ? 0 : Number(Number(banRate).toFixed(2));

    const positionList = {
      top: 'TOP',
      jungle: 'JUNGLE',
      mid: 'MIDDLE',
      ad: 'BOTTOM',
      support: 'UTILITY',
      default: 'default position',
    };
    position = !position
      ? positionList.default
      : Object.keys(positionList).find((key) => positionList[key] === position);

    return plainToInstance(ChampRateDataDto, {
      ...withoutSpell,
      banRate,
      position,
      spell1Img,
      spell2Img,
      version,
    });
  }

  async createSkill(skill: SkillSet[]) {
    const propertyChange = skill.map((v) => {
      return {
        id: v.skillId,
        name: v.skillName,
        desc: v.skillDesc,
        toolTip: v.skillToolTip,
        image: v.skillImg,
      };
    });
    return propertyChange.map((v) => plainToInstance(ChampSkillCommonDTO, v));
  }

  async createtargetChampResponse(
    champDataDto: ChampCommonDTO,
    champRateDto: ChampRateDataDto,
    skill: ChampSkillCommonDTO[],
  ) {
    return plainToInstance(TargetChampionResDto, {
      ...champDataDto,
      ...champRateDto,
      skill,
    });
  }
}
