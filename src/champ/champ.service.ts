import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { instanceToInstance, plainToClass, plainToInstance } from 'class-transformer';
import { ChampRepository } from './champ.repository';
import { rateVersionDTO } from './dto/champ-rate/champ.rate.version.dto';
import { ChampSkillCommonDTO } from './dto/champ-skill/champ.skill.common.dto';
import { ChampResDto } from './dto/champ/champ.common.dto';
import { preferChampUsersResDTO } from './dto/prefer-champ/prefer.champ.users.dto';
import { TargetChampionReqDTO } from './dto/target-champion/target.request.dto';
import { TargetChampionResDto } from './dto/target-champion/target.response.dto';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}

  async getChampList(): Promise<ChampResDto[]> {
    return await this.champRepository.getChampList();
  }

  async getPreferChampUsers(champId: string): Promise<preferChampUsersResDTO[] | []> {
    return await this.champRepository.findPreferChampUsers(champId);
  }

  //TODO: 스펠 이미지 추가
  async getTargetChampion(param: TargetChampionReqDTO) {
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
      default: 'default position',
    };
    //파라미터값을 DB에 있는 포지션명으로 변경
    const positionDbName = positionList[param.position];

    //default 파라미터인 경우 최대 많이 플레이한 포지션 산출 / DB에 있는 포지션명 할당
    const getPosition = emptyPosition
      ? await this.champRepository.getMostPosition(param.champId, rateLatestVersions[0])
      : positionDbName;

    //default 파라미터인 경우 Dto get 호출 / DB에 있는 포지션명 할당
    const champPosition = emptyPosition ? getPosition?.position : getPosition;

    const champData = await this.champRepository.getChampData(
      param.champId,
      champPosition,
      rateLatestVersions[0],
    );

    const champDefaultData = await this.champRepository.getChampDefaultData(param.champId);

    const skill = await this.champRepository.getSkillData(param.champId);

    const banInfo = await this.champRepository.getBanRate(param.champId, rateLatestVersions[0]);

    //챔피언 기본 정보
    const { id } = champDefaultData;
    const { champNameKo } = champDefaultData;
    const { champNameEn } = champDefaultData;
    const { champImg } = champDefaultData;

    //데이터 분석을 통한 챔피언 상세 정보
    const { winRate } = champData;
    const { banRate } = banInfo;
    const { pickRate } = champData;
    const { spell1 } = champData;
    const { spell2 } = champData;
    const { version } = champData;
    const targetPosition = champData.position;

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
      default: 'default spell Image',
    };

    const spell1Img =
      spell1 !== spellInfo.default
        ? `${process.env.S3_ORIGIN_URL}/spell/${spellInfo[spell1]}.png`
        : spell1;
    const spell2Img =
      spell2 !== spellInfo.default
        ? `${process.env.S3_ORIGIN_URL}/spell/${spellInfo[spell2]}.png`
        : spell2;

    const data = {
      id,
      champNameKo,
      champNameEn,
      champImg,
      winRate,
      banRate,
      pickRate,
      // DB에서 가져온 position이 default position이 아니면 positionList에서 position 이름 변경 / default position
      position:
        targetPosition !== positionList.default
          ? Object.keys(positionList).find((key) => positionList[key] === targetPosition)
          : targetPosition,
      spell1Img,
      spell2Img,
      version,
      skill,
    };
    return new TargetChampionResDto(data);
  }

  private async getVersion(versionList: rateVersionDTO): Promise<Array<string>> {
    let data = [];
    for (const value of versionList.version) {
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
}
