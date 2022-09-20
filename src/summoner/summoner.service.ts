import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { isArray } from 'class-validator';
import { SummonerInfoDTO } from './dto/summoner.dto';
import { SummonerRepository } from './summoner.repository';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerRepository: SummonerRepository,
    private readonly axios: HttpService,
  ) {}

  async refreshSummonerInfo(summonerName: string) {
    const response = await this.axios
      .get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/ + ${encodeURIComponent(
          summonerName,
        )} + ?api_key=${process.env.RIOT_API_KEY}`,
      )
      .toPromise();

    const { data } = response;

    const summonerIcon = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;

    const detailResponse = await this.axios
      .get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${process.env.RIOT_API_KEY}`,
      )
      .toPromise();

    const mostChampResponse = await this.axios
      .get(
        `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${data.id}/top?count=3&api_key=${process.env.RIOT_API_KEY}
        `,
      )
      .toPromise();

    const mostchamp = mostChampResponse.data;
    const mostchampId = [
      mostchamp[0].championId,
      mostchamp[1].championId,
      mostchamp[2].championId,
    ];

    const detailData = detailResponse.data[0];
    const win = detailData.wins;
    const lose = detailData.losses;

    const winRate = Math.floor((win / (win + lose)) * 100);
    let summonerInfo;
    //디비에 유저 전적 데이터가 없을 경우 summonerInfo를 return 해주고 넣어준다.
    let image;
    switch (detailData.tier) {
      case 'IRON':
        image = 'https://erunjrun.com/tier/Iron.png';
        break;
      case 'BRONZE':
        image = 'https://erunjrun.com/tier/Bronze.png';
        break;
      case 'SILVER':
        image = 'https://erunjrun.com/tier/Silver.png';
        break;
      case 'GOLD':
        image = 'https://erunjrun.com//tier/Gold.png';
        break;
      case 'PLATINUM':
        image = 'https://erunjrun.com/tier/Platinum.png';
        break;
      case 'DIAMOND':
        image = 'https://erunjrun.com/tier/Diamond.png';
        break;
      case 'MASTER':
        image = 'https://erunjrun.com/tier/Master.png';
        break;
      case 'GRANDMASTER':
        image = 'https://erunjrun.com/tier/Grandmaster.png';
        break;
      case 'CHALLENGER':
        image = 'https://erunjrun.com/tier/Challenger.png';
        break;
    }
    summonerInfo = {
      summonerName: data.name,
      summonerIcon,
      tier: detailData.tier + ' ' + detailData.rank,
      lp: detailData.leaguePoints,
      tierImg: image,
      win: detailData.wins,
      lose: detailData.losses,
      winRate,
      mostChamp1: mostchamp[0].championId,
      mostChamp2: mostchamp[1].championId,
      mostChamp3: mostchamp[2].championId,
    };

    let findSummoner = await this.summonerRepository.findSummoner(data.name);
    let summonerData;

    if (!findSummoner) {
      await this.summonerRepository.insertSummoner(summonerInfo);
      findSummoner = await this.summonerRepository.findSummoner(data.name);
      summonerData = {
        summonerName: findSummoner.summonerName,
        summonerIcon: findSummoner.summonerIcon,
        tier: findSummoner.tier,
        lp: findSummoner.lp,
        tierImg: findSummoner.tierImg,
        win: findSummoner.win,
        lose: findSummoner.lose,
        winRate: findSummoner.winRate,
        mostChamps: [
          findSummoner.mostChamp1,
          findSummoner.mostChamp2,
          findSummoner.mostChamp3,
        ],
      };
      return summonerData;
    }
    await this.summonerRepository.updateSummoner(summonerInfo);
    summonerData = {
      summonerName: findSummoner.summonerName,
      summonerIcon: findSummoner.summonerIcon,
      tier: findSummoner.tier,
      lp: findSummoner.lp,
      tierImg: findSummoner.tierImg,
      win: findSummoner.win,
      lose: findSummoner.lose,
      winRate: findSummoner.winRate,
      mostChamps: [
        findSummoner.mostChamp1,
        findSummoner.mostChamp2,
        findSummoner.mostChamp3,
      ],
    };
    return summonerData;
    await this.summonerInfo(data.name);
  }

  async summonerInfo(summonerName: string) {
    await this.summonerRepository.summonerInfo(summonerName);
  }
}
