import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';
import { ChampCommonDTO, ChampDto } from './dto/champ/champ.common.dto';
import { preferChampUsersDTO } from './dto/prefer-champ/prefer.champ.dto';
import { TargetChampionReqDTO } from './dto/target-champion/target.request.dto';
import { TargetChampionResDto } from './dto/target-champion/target.response.dto';
import { skillInfo } from './test/data/champ.info';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}

  private async getVersion(versions: { version: string }[]): Promise<Array<string>> {
    let data = [];
    for (const value of versions) {
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
    return versionList_DESC;
  }

  async getChampList(): Promise<ChampDto[]> {
    const champList = await this.champRepository.getChampList();
    return ChampDto.transformDTO(champList);
  }

  //TODO: 스펠 이미지 추가
  async getTargetChampion(param: TargetChampionReqDTO): Promise<TargetChampionResDto> {
    const existChamp = await this.champRepository.existChamp(param.champId);
    if (!existChamp) {
      throw new HttpException('해당하는 챔피언 정보가 없습니다.', HttpStatus.BAD_REQUEST);
    }

    const rateVersionList = await this.champRepository.rateVersion();
    const rateLatestVersions = await this.getVersion(rateVersionList);

    const emptyPosition = param.position === 'default' ? true : false;

    const positionList = {
      top: 'TOP',
      jungle: 'JUNGLE',
      mid: 'MIDDLE',
      ad: 'BOTTOM',
      support: 'UTILITY',
      default: 'default',
    };
    //파라미터값을 DB에 있는 포지션명으로 변경
    const positionDbName = positionList[param.position];

    //default 파라미터인 경우 최대 많이 플레이한 포지션 산출
    const targetPosition = emptyPosition ? await this.champRepository.getMostPosition(param.champId, rateLatestVersions[0]) : positionDbName;

    //DB에서 산출한 position명 또는 DB에 있는 포지션값으로 할당
    const champPosition = emptyPosition ? targetPosition[0]?.position : targetPosition;
    //존재하면 default로 요청
    const champData = await this.champRepository.getChampData(param.champId, champPosition, rateLatestVersions[0]);
    const banData = await this.champRepository.getBanRate(param.champId, rateLatestVersions[0]);
    const skill = champData.skillInfo.map((v) => {
      return {
        id: v.skillId,
        name: v.skillName,
        desc: v.skillDesc,
        toolTip: v.skillToolTip,
        image: v.skillImg,
      };
    });

    //챔피언 기본 정보
    const { id } = champData.champDefaultData;
    const { champNameKo } = champData.champDefaultData;
    const { champNameEn } = champData.champDefaultData;
    const { champImg } = champData.champDefaultData;

    //데이터 분석을 통한 챔피언 상세 정보
    const existWinRate = champData.champInfo[0]?.winRate;
    const existBanRate = banData ? banData.banCount : 0;
    const existPickRate = champData.champInfo[0]?.pickRate;
    const existVersion = champData.champInfo[0]?.version;
    const existPosition = champData.champInfo[0]?.position;

    const winRate = existWinRate ? Number(Number(existWinRate).toFixed(2)) : 0;
    const banRate = existBanRate ? Number(Number(existBanRate).toFixed(2)) : 0;
    const pickRate = existPickRate ? Number(Number(existPickRate).toFixed(2)) : 0;
    const version = existVersion ? existVersion : 'default version';

    const spell1 = champData.champInfo[0]?.spell1;
    const spell2 = champData.champInfo[0]?.spell2;
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
    const spell1Img = spell1 ? `${process.env.S3_ORIGIN_URL}/spell/${spellInfo[spell1]}.png` : 'default spell Image';
    const spell2Img = spell2 ? `${process.env.S3_ORIGIN_URL}/spell/${spellInfo[spell2]}.png` : 'default spell Image';
    const data = {
      id,
      champNameKo,
      champNameEn,
      champImg,
      winRate,
      banRate,
      pickRate,
      //position 정보가 DB에 없을경우 default 있는경우 DB position명을 파라미터 포지션명으로 변환
      position: existPosition ? Object.keys(positionList).find((key) => positionList[key] === existPosition) : 'default position',
      spell1Img,
      spell2Img,
      version,
      skill,
    };
    return new TargetChampionResDto(data);
  }

  async getPreferChampUsers(champId: string): Promise<preferChampUsersDTO[]> {
    const targetUser = await this.champRepository.findPreferChampUsers(champId);

    return targetUser;
  }
}
