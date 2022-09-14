import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';

@Injectable()
export class ChampService {
  constructor(
    private readonly champRepository: ChampRepository,
    private readonly axios: HttpService,
  ) {}

  async targetChampionInfo(champName): Promise<any> {
    for (const key in champName) {
      const value = champName[key];
      const targetChampionResult = await this.axios
        .get(
          `https://ddragon.leagueoflegends.com/cdn/12.17.1/data/ko_KR/champion/${value}.json`,
        )
        .toPromise();
      const targetChampionInfo = targetChampionResult.data.data;

      const championId = targetChampionInfo[value].key;
      const championNameEn = targetChampionInfo[value].id;
      const championNameKo = targetChampionInfo[value].name;
      const championImg = `http://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championNameEn}_0.jpg`;

      await this.champRepository.targetChampionInfoSave(
        championId,
        championNameEn,
        championNameKo,
        championImg,
      );

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

      const passiveInfo = {
        id: 'passive',
        name: passive.name,
        desc: passive.description,
        image: `http://ddragon.leagueoflegends.com/cdn/12.17.1/img/passive/${passive.image.full}`,
      };

      await this.champRepository.targetChampionSkillInfoSave(
        championId,
        qSkill,
        wSkill,
        eSkill,
        rSkill,
        passiveInfo,
      );
    }
  }

  async getChampList(): Promise<any> {
    const champRequest = await this.axios
      .get(
        `https://ddragon.leagueoflegends.com/cdn/12.17.1/data/ko_KR/champion.json`,
      )
      .toPromise();
    const champList = champRequest.data.data;
    const champName = Object.keys(champList);

    this.targetChampionInfo(champName);
  }
}
