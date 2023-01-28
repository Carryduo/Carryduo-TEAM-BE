import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';
import { ChampDetailCommonDTO } from './dto/champ-detail/champ.detail.common.dto';
import { ChampDetailResponseDTO, spellData } from './dto/champ-detail/champ.detail.dto';
import { ChampPosition } from './dto/champ-rate/champ.rate.dto';
import { preferChampUsersDTO } from './dto/prefer-champ/prefer.champ.dto';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}

  async getVersion(versions) {
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

  async getChampList() {
    return await this.champRepository.getChampList();
  }

  //테스트 함수
  //TODO: 스펠 이미지 추가
  async getTargetChampion2(champId: string, position: string) {
    const existChamp = await this.champRepository.existChamp(champId);

    if (!existChamp) {
      throw new HttpException('해당하는 챔피언 정보가 없습니다.', HttpStatus.BAD_REQUEST);
    }

    const rateVersionList = await this.champRepository.rateVersion();
    const rateLatestVersions = await this.getVersion(rateVersionList);

    let emptyPosition = false;

    if (position === 'default') emptyPosition = true;

    const positionList = {
      top: 'TOP',
      jungle: 'JUNGLE',
      mid: 'MIDDLE',
      ad: 'BOTTOM',
      support: 'UTILITY',
      default: 'default',
    };
    //파라미터값을 DB에 있는 포지션명으로 변경
    const positionDbName = positionList[position];

    //default 파라미터인 경우 최대 많이 플레이한 포지션 산출
    const findMostPosition = emptyPosition && (await this.champRepository.getMostPosition(champId, rateLatestVersions[0]));

    //DB에서 산출한 position명 또는 DB에 있는 포지션값으로 할당
    const champPosition = emptyPosition ? findMostPosition[0]?.position : positionDbName;

    //존재하면 default로 요청
    const champData = await this.champRepository.getChampData(champId, champPosition, rateLatestVersions[0]);
    const banData = await this.champRepository.getBanRate(champId, rateLatestVersions[0]);
    const skill = champData.skillInfo.map((v) => {
      return {
        id: v.id,
        name: v.name,
        desc: v.skillDesc,
        toolTip: v.toolTip,
        image: v.image,
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
    const spellData = await this.getSpellImage(spell1, spell2);
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
      spell1Img: spellData.spell1Img,
      spell2Img: spellData.spell2Img,
      version,
      skill,
    };

    return data;
  }

  async getSpellImage(spell1: number, spell2: number) {
    const SummonerBarrier = 21;
    const SummonerBoost = 1;
    const SummonerDot = 14;
    const SummonerExhaust = 3;
    const SummonerFlash = 4;
    const SummonerHaste = 6;
    const SummonerHeal = 7;
    const SummonerMana = 13;
    const SummonerSmite = 11;
    const SummonerTeleport = 12;
    let spell1Img: string;
    let spell2Img: string;
    switch (spell1) {
      case SummonerBarrier:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBarrier.png`;
        break;
      case SummonerBoost:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBoost.png`;
        break;
      case SummonerDot:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerDot.png`;
        break;
      case SummonerExhaust:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerExhaust.png`;
        break;
      case SummonerFlash:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerFlash.png`;
        break;
      case SummonerHaste:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHaste.png`;
        break;
      case SummonerHeal:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHeal.png`;
      case SummonerMana:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerMana.png`;
        break;
      case SummonerSmite:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerSmite.png`;
        break;
      case SummonerTeleport:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerTeleport.png`;
        break;
      default:
        spell1Img = `default spell image`;
        break;
    }
    switch (spell2) {
      case SummonerBarrier:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBarrier.png`;
        break;
      case SummonerBoost:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBoost.png`;
        break;
      case SummonerDot:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerDot.png`;
        break;
      case SummonerExhaust:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerExhaust.png`;
        break;
      case SummonerFlash:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerFlash.png`;
        break;
      case SummonerHaste:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHaste.png`;
        break;
      case SummonerHeal:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHeal.png`;
        break;
      case SummonerMana:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerMana.png`;
        break;
      case SummonerSmite:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerSmite.png`;
        break;
      case SummonerTeleport:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerTeleport.png`;
        break;
      default:
        spell2Img = `default spell image`;
        break;
    }
    return { spell1Img, spell2Img };
  }

  //기존 함수
  async getTargetChampion(champId: string): Promise<ChampDetailResponseDTO> {
    const existChamp = await this.champRepository.existChamp(champId);

    if (!existChamp) {
      throw new HttpException('해당하는 챔피언 정보가 없습니다.', HttpStatus.BAD_REQUEST);
    }
    const skill: ChampDetailCommonDTO[] = [];

    const rateVersionList = await this.champRepository.rateVersion();
    const rateLatestVersions = await this.getVersion(rateVersionList);

    let champInfo = await this.champRepository.getTargetChampion(champId, rateLatestVersions[0]);
    if (!champInfo) {
      champInfo = await this.champRepository.getTargetChampion(champId, rateLatestVersions[1]);
    }

    const SummonerBarrier = 21;
    const SummonerBoost = 1;
    const SummonerDot = 14;
    const SummonerExhaust = 3;
    const SummonerFlash = 4;
    const SummonerHaste = 6;
    const SummonerHeal = 7;
    const SummonerMana = 13;
    const SummonerSmite = 11;
    const SummonerTeleport = 12;

    const spellVersionList = await this.champRepository.spellVersion();
    const spellLatestVersions = await this.getVersion(spellVersionList);
    const champSpellData = await this.champRepository.getChampSpell(champId, spellLatestVersions[0]);

    let spell1Img: string;
    let spell2Img: string;

    const spellInfo: spellData[] = [];

    switch (champSpellData[0].spell_spell1) {
      case SummonerBarrier:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBarrier.png`;
        break;
      case SummonerBoost:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBoost.png`;
        break;
      case SummonerDot:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerDot.png`;
        break;
      case SummonerExhaust:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerExhaust.png`;
        break;
      case SummonerFlash:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerFlash.png`;
        break;
      case SummonerHaste:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHaste.png`;
        break;
      case SummonerHeal:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHeal.png`;
      case SummonerMana:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerMana.png`;
        break;
      case SummonerSmite:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerSmite.png`;
        break;
      case SummonerTeleport:
        spell1Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerTeleport.png`;
        break;
    }
    switch (champSpellData[0].spell_spell2) {
      case SummonerBarrier:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBarrier.png`;
        break;
      case SummonerBoost:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerBoost.png`;
        break;
      case SummonerDot:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerDot.png`;
        break;
      case SummonerExhaust:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerExhaust.png`;
        break;
      case SummonerFlash:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerFlash.png`;
        break;
      case SummonerHaste:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHaste.png`;
        break;
      case SummonerHeal:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerHeal.png`;
        break;
      case SummonerMana:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerMana.png`;
        break;
      case SummonerSmite:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerSmite.png`;
        break;
      case SummonerTeleport:
        spell2Img = `${process.env.S3_ORIGIN_URL}/spell/SummonerTeleport.png`;
        break;
    }
    const total = Number(champSpellData[0].total);

    const pickRate = Number(champSpellData[0].spell_pick_rate);

    const version = champSpellData[0].spell_version;

    spellInfo.push({
      total,
      pickRate,
      spell1Img,
      spell2Img,
      spellVersion: version,
    });

    champInfo.champSkillInfo.map((value) => {
      skill.push({
        id: value.skillId,
        name: value.skillName,
        desc: value.skillDesc,
        toolTip: value.skillToolTip,
        image: value.skillImg,
      });
    });

    const rate: ChampPosition = {
      top: Number(champInfo.champRate[0].topRate),
      jungle: Number(champInfo.champRate[0].jungleRate),
      mid: Number(champInfo.champRate[0].midRate),
      ad: Number(champInfo.champRate[0].adRate),
      support: Number(champInfo.champRate[0].supportRate),
    };

    const data = {
      id: champInfo.id,
      champNameKo: champInfo.champNameKo,
      champNameEn: champInfo.champNameEn,
      champImg: champInfo.champMainImg,
      winRate: Number(champInfo.champRate[0].winRate),
      banRate: Number(champInfo.champRate[0].banRate),
      pickRate: Number(champInfo.champRate[0].pickRate),
      rateInfo: {
        rateVersion: champInfo.champRate[0].version,
        rate,
      },
      skill,
      spellInfo,
    };
    return data;
  }

  async getPreferChampUsers(champId: string): Promise<preferChampUsersDTO[]> {
    const targetUser = await this.champRepository.findPreferChampUsers(champId);

    return targetUser;
  }
}
