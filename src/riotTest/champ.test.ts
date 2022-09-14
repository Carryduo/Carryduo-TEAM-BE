import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { ChampRepository } from '../champ/champ.repository';

@Injectable()
export class ChampService {
  constructor(
    private readonly champRepository: ChampRepository,
    private readonly axios: HttpService,
  ) {}

  async targetChampionDetailInfo(spells: object, passive: object) {
    console.log(passive);
    const qSkill = {
      id: spells[0].id,
      name: spells[0].name,
      desc: spells[0].description,
      tooltip: spells[0].tooltip,
      image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[0].image.full}`,
    };
    console.log(qSkill);
    const wSkill = {
      id: spells[1].id,
      name: spells[1].name,
      desc: spells[1].description,
      tooltip: spells[1].tooltip,
      image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[1].image.full}`,
    };
    const eSkill = {
      id: spells[2].id,
      name: spells[2].name,
      desc: spells[2].description,
      tooltip: spells[2].tooltip,
      image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[2].image.full}`,
    };
    const rSkill = {
      id: spells[3].id,
      name: spells[3].name,
      desc: spells[3].description,
      tooltip: spells[3].tooltip,
      image: `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/spell/${spells[3].image.full}`,
    };

    // const passive = {
    //   passiveSkillName: passive.name,
    //   passiveSkillDesc: passive.description,
    //   passiveSkillImg: `http://ddragon.leagueoflegends.com/cdn/12.17.1/img/passive/${passive.image.full}`,
    // };

    // this.champRepository.targetChampionDetailInfoSave(
    //   qSkill,
    //   wSkill,
    //   eSkill,
    //   rSkill,
    //   passive,
    // );
  }

  async targetChampionInfo(champName): Promise<any> {
    for (let key in champName) {
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
      this.targetChampionDetailInfo(spells, passive);
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
