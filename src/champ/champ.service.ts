import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';

@Injectable()
export class ChampService {
  constructor(
    private readonly champRepository: ChampRepository,
    private readonly axios: HttpService,
  ) {}

  async getChampList() {
    return await this.champRepository.getChmapList();
  }

  async getTargetChampion(champId: string) {
    let skill = [];

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

    for (let csd in chmapSpellData) {
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

  //-------------------------------------------------------------------------------------------------------------------------
  //챔피언 정보 불러와서 DB 저장 함수
  async riotChampData() {
    const champRequest = await this.axios
      .get(
        `https://ddragon.leagueoflegends.com/cdn/12.17.1/data/ko_KR/champion.json`,
      )
      .toPromise();
    const champList = champRequest.data.data;

    const champName = Object.keys(champList);
    for (const key in champName) {
      const value = champName[key];
      const targetChampionResult = await this.axios
        .get(
          `https://ddragon.leagueoflegends.com/cdn/12.17.1/data/ko_KR/champion/${value}.json`,
        )
        .toPromise();
      const targetChampionInfo = targetChampionResult.data.data;

      const championId: number = targetChampionInfo[value].key;
      const championNameEn: string = targetChampionInfo[value].id;
      const championNameKo: string = targetChampionInfo[value].name;
      const championMainImg: string = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championNameEn}_0.jpg`;
      const championImg: string = `https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${championNameEn}.png`;

      const data = {
        championId,
        championNameEn,
        championNameKo,
        championMainImg,
        championImg,
      };
      await this.champRepository.targetChampionInfoSave(data);

      const { spells } = targetChampionInfo[value];
      const { passive } = targetChampionInfo[value];

      const qSkill = {
        id: 'q',
        name: spells[0].name,
        desc: spells[0].description,
        tooltip: spells[0].tooltip,
        image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[0].image.full}`,
      };
      const wSkill = {
        id: 'w',
        name: spells[1].name,
        desc: spells[1].description,
        tooltip: spells[1].tooltip,
        image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[1].image.full}`,
      };
      const eSkill = {
        id: 'e',
        name: spells[2].name,
        desc: spells[2].description,
        tooltip: spells[2].tooltip,
        image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[2].image.full}`,
      };
      const rSkill = {
        id: 'r',
        name: spells[3].name,
        desc: spells[3].description,
        tooltip: spells[3].tooltip,
        image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[3].image.full}`,
      };

      const passiveSkill = {
        id: 'passive',
        name: passive.name,
        desc: passive.description,
        image: `http://ddragon.leagueoflegends.com/cdn/12.17.1/img/passive/${passive.image.full}`,
      };

      this.champRepository.targetChampionSkillInfoSave(
        championId,
        qSkill,
        wSkill,
        eSkill,
        rSkill,
        passiveSkill,
      );
    }
  }

  async fixTooltip() {
    const dataList = await this.champRepository.getTooltip();

    for (let i = 0; i < dataList.length; i++) {
      if (dataList[i].skillDesc) {
        dataList[i].skillDesc = validateToolTip(dataList[i].skillDesc);
      }
      if (dataList[i].skillToolTip) {
        dataList[i].skillToolTip = validateToolTip(dataList[i].skillToolTip);
      }
      const result = await this.champRepository.editToolTip(
        dataList[i].id,
        dataList[i].skillToolTip,
        dataList[i].skillDesc,
      );
      console.log(result);
    }

    return { succes: true };
  }
}

function validateToolTip(value: string): string {
  const data = value.split('');
  const checkUnique = /[<>/:*#'="-]/;
  const checkEng = /[a-zA-Z]/;
  const checkNum = /[0-9]/;
  const result = [];

  for (let i = 0; i < data.length; i++) {
    if (!checkUnique.test(data[i])) {
      if (!checkEng.test(data[i])) {
        if (checkNum.test(data[i])) {
          data[i] = '';
        }
        result.push(data[i]);
      }
    }
  }
  let secondData = result.join('');

  while (secondData.includes('{{') && secondData.includes('}}')) {
    replace(secondData);
  }
  function replace(value: string) {
    secondData = value
      .replace('{{', '!')
      .replace('}}', '?')
      .replace('!  ?', '?')
      .replace('!', '')
      .replace('.?', '.');
    return;
  }
  return secondData;
}
