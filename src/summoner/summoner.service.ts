import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SummonerInfoDTO } from './dto/summoner.dto';
import { SummonerRepository } from './summoner.repository';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerRepository: SummonerRepository,
    private readonly axios: HttpService,
  ) {}

  async summonerDataCleansing(summoner: SummonerInfoDTO) {
    const summonerData = {
      summonerName: summoner.summonerName,
      summonerIcon: summoner.summonerIcon,
      tier: summoner.tier,
      lp: summoner.lp,
      tierImg: summoner.tierImg,
      win: summoner.win,
      lose: summoner.lose,
      winRate: summoner.winRate,
      mostChamps: [
        summoner.mostChamp1,
        summoner.mostChamp2,
        summoner.mostChamp3,
      ],
    };
    return summonerData;
  }

  async findSummoner(summonerName: string) {
    const summoner = await this.summonerRepository.findSummoner(summonerName);
    if (!summoner) {
      const result = await this.summonerRiotRequest(summonerName);
      await this.summonerRepository.insertSummoner(result);
      const summonerInfo = await this.summonerRepository.findSummoner(
        summonerName,
      );
      return await this.summonerDataCleansing(summonerInfo);
    }
    return await this.summonerDataCleansing(summoner);
  }

  async updateSummoner(summonerName: string) {
    const summoner = await this.summonerRepository.findSummoner(summonerName);
    if (!summoner)
      throw new HttpException(
        '갱신할 수 없는 소환사입니다.(DB에 소환사가 없습니다.)',
        HttpStatus.BAD_REQUEST,
      );
    const result = await this.summonerRiotRequest(summonerName);
    await this.summonerRepository.updateSummoner(result);
    const summonerInfo = await this.summonerRepository.findSummoner(
      summonerName,
    );
    const summonerData = await this.summonerDataCleansing(summonerInfo);
    return summonerData;
  }

  async getSummoner(summonerName: string) {
    const summoner = await this.findSummoner(summonerName);
    return summoner;
  }

  async summonerRiotRequest(summonerName: string) {
    try {
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

      const detailData = detailResponse.data[0];

      if (!detailData)
        throw new HttpException(
          '언랭크 소환사 입니다.',
          HttpStatus.BAD_REQUEST,
        );

      const win = detailData.wins;
      const lose = detailData.losses;

      const winRate = Math.floor((win / (win + lose)) * 100);
      let image: string;
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
      const summonerData = {
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
      return summonerData;
    } catch (err) {
      console.log(err);
      if (err.response.status === 429) {
        throw new HttpException(
          '라이엇API 요청 과도화',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      } else if (err.response.status === 403) {
        throw new HttpException('라이엇API 키 만료', HttpStatus.FORBIDDEN);
      } else if (err.status === 400) {
        throw new HttpException(err.response, err.status);
      } else {
        throw new HttpException(err.response.statusText, err.response.status);
      }
    }
  }
}
