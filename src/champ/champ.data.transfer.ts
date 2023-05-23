import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChampRepository } from './champ.repository';
import {
  ChampRateDataDto,
  GetChampRate,
} from './dto/champ-rate/champ.rate.dto';
import {
  ChampSkillCommonDTO,
  SkillSet,
} from './dto/champ-skill/champ.skill.common.dto';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { TargetChampionReqDTO } from './dto/target-champion/target.request.dto';
import { TargetChampionResDto } from './dto/target-champion/target.response.dto';

@Injectable()
export class TransferChampData {
  constructor(private readonly champRepository: ChampRepository) {}

  gameVersion(versionList: { version: string }[]): string {
    let data = [];
    for (const value of versionList) {
      data.push(value.version);
    }

    data = data.filter((version) => {
      if (version[version.length - 1] === '.') {
        version = version.slice(0, -1);
      }
      if (!isNaN(Number(version))) {
        return version;
      }
    });
    data = data.sort((a, b) => {
      return b.split('.')[0] - a.split('.')[0];
    });
    let versionList_DESC = [];
    let outdatedVersionList = [];
    // recentVersion = 13.10 에서 13을 의미
    const recentVersion = Number(String(data[0]).split('.')[0]);
    for (let i = 0; i < data.length; i++) {
      const version = data[i];
      if (Number(version.split('.')[0]) < recentVersion) {
        outdatedVersionList.push(version);
      } else {
        versionList_DESC.push(version);
      }
    }
    // 최근버전 모음 (ex 13.1, 13.10)
    versionList_DESC = versionList_DESC.sort((a, b) => {
      return Number(String(b).split('.')[1]) - Number(String(a).split('.')[1]);
    });
    // 이전버전 모음  (ex. 12.1, 12.10)
    outdatedVersionList = outdatedVersionList.sort((a, b) => {
      return Number(String(b).split('.')[1]) - Number(String(a).split('.')[1]);
    });
    // 최신버전 모음 뒤에 이전버전 합치기
    versionList_DESC.push(...outdatedVersionList);

    return versionList_DESC[0];
  }

  async champPosition(
    param: TargetChampionReqDTO,
    version: string,
  ): Promise<string> {
    const positionList = {
      top: 'TOP',
      jungle: 'JUNGLE',
      mid: 'MIDDLE',
      ad: 'BOTTOM',
      support: 'UTILITY',
      default: 'default position',
    };

    //파라미터값을 DB에 있는 포지션명으로 변경
    const positionDbName =
      param.position === 'default' ? false : positionList[param.position];

    //default 파라미터인 경우 최대 많이 플레이한 포지션 산출 or DB에 있는 포지션명 할당
    const findPosition = !positionDbName
      ? await this.champRepository.getMostPosition(param.champId, version)
      : positionDbName;

    //default 파라미터인 경우 모스트 포지션 값 할당 or DB에 있는 포지션명 할당
    return !positionDbName ? findPosition[0]?.position : findPosition;
  }

  async champRate(
    champRateInfo: GetChampRate[],
    banRate: string | number,
    position: string,
  ): Promise<ChampRateDataDto> {
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

    if (champRateInfo.length === 0) {
      rate = new GetChampRate(null);
    } else {
      rate = new GetChampRate(champRateInfo[0]);
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

  async champSkill(skill: SkillSet[]): Promise<ChampSkillCommonDTO[]> {
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
}
