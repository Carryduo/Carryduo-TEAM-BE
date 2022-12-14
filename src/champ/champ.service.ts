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
