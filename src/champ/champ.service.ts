import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}
  async getChampList() {
    return await this.champRepository.getChmapList();
  }

  async getTargetChampion(champId: string) {
    const skill = [];

    const champInfo = await this.champRepository.getTargetChampion(champId);
    if (!champInfo) {
      throw new HttpException(
        '해당하는 챔피언 정보가 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
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

    const chmapSpellData = await this.champRepository.getChampSpell(champId);

    let spell1Img: string;
    let spell2Img: string;

    const spellInfo = [];

    for (const csd in chmapSpellData) {
      const key = csd;
      switch (chmapSpellData[key].spell_spell1) {
        case SummonerBarrier:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerBarrier.png';
          break;
        case SummonerBoost:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerBoost.png';
          break;
        case SummonerDot:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerDot.png';
          break;
        case SummonerExhaust:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerExhaust.png';
          break;
        case SummonerFlash:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerFlash.png';
          break;
        case SummonerHaste:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerHaste.png';
          break;
        case SummonerHeal:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerHeal.png';
        case SummonerMana:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerMana.png';
          break;
        case SummonerSmite:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerSmite.png';
          break;
        case SummonerTeleport:
          spell1Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerTeleport.png';
          break;
      }
      switch (chmapSpellData[key].spell_spell2) {
        case SummonerBarrier:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerBarrier.png';
          break;
        case SummonerBoost:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerBoost.png';
          break;
        case SummonerDot:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerDot.png';
          break;
        case SummonerExhaust:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerExhaust.png';
          break;
        case SummonerFlash:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerFlash.png';
          break;
        case SummonerHaste:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerHaste.png';
          break;
        case SummonerHeal:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerHeal.png';
          break;
        case SummonerMana:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerMana.png';
          break;
        case SummonerSmite:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerSmite.png';
          break;
        case SummonerTeleport:
          spell2Img =
            ' https://ddragon.leagueoflegends.com/cdn/12.19.1/img/spell/SummonerTeleport.png';
          break;
      }
      //상위 2개의 스펠데이터에서 픽률을 다시 구한다.
      const sampleNum =
        chmapSpellData[0].spell_sample_num + chmapSpellData[1].spell_sample_num;

      let pickRate = (chmapSpellData[key].spell_sample_num / sampleNum) * 100;
      pickRate = Number(pickRate.toFixed(2));

      spellInfo.push({
        total: chmapSpellData[key].spell_sample_num,
        pickRate,
        spell1Img,
        spell2Img,
      });
    }

    champInfo.champSkillInfo.map((value) => {
      skill.push({
        id: value.skillId,
        name: value.skillName,
        desc: value.skillDesc,
        toolTip: value.skillToolTip,
        image: value.skillImg,
      });
    });

    const data = {
      id: champInfo.id,
      winRate: champInfo.winRate,
      banRate: champInfo.banRate,
      pickRate: champInfo.pickRate,
      champNameKo: champInfo.champNameKo,
      champNameEn: champInfo.champNameEn,
      champImg: champInfo.champMainImg,
      rate: {
        top: champInfo.topRate,
        jungle: champInfo.jungleRate,
        mid: champInfo.midRate,
        ad: champInfo.adRate,
        support: champInfo.supportRate,
      },
      skill,
      spellInfo,
    };
    return data;
  }

  async getPreferChampUsers(champId: string) {
    const targetUser = await this.champRepository.findPreferChampUsers(champId);

    return targetUser;
  }
}
