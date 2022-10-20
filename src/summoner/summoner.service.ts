import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SummonerHistoryDataCleansing } from './data-cleansing/history.data.cleansing';
import { summonerResponseCleansing } from './data-cleansing/summoner.data.cleansing';
import {
  SummonerAllDataDTO,
  SummonerDataDTO,
} from './dto/summoner/summoner.data.dto';

import { SummonerRequestDTO } from './dto/summoner/summoner.request.dto';
import { SummonerDBResponseDTO } from './dto/summoner/summoner.response.dto';
import { SummonerRepository } from './summoner.repository';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerRepository: SummonerRepository,
    private readonly axios: HttpService,
    private readonly summonerResponse: summonerResponseCleansing,
    private readonly summonerHistory: SummonerHistoryDataCleansing,
  ) {}

  async cleansingData(summonerName: string, summoner: SummonerDBResponseDTO) {
    const history = await this.summonerHistory.historyDataCleansing(
      summonerName,
    );
    const summonerData = await this.summonerResponse.responseCleansing(
      summoner,
      history,
    );
    return summonerData;
  }

  async getSummoner(
    summonerName: string,
  ): Promise<SummonerAllDataDTO | SummonerDataDTO> {
    const summoner = await this.summonerRepository.findSummoner(summonerName);
    if (!summoner) {
      return await this.saveSummoner(summonerName);
    }
    return await this.cleansingData(summonerName, summoner);
  }

  async saveSummoner(
    summonerName: string,
  ): Promise<SummonerAllDataDTO | SummonerDataDTO> {
    const newSummoner = await this.summonerRiotRequest(summonerName);
    await this.summonerRepository.insertSummoner(newSummoner);
    const summoner = await this.summonerRepository.findSummoner(summonerName);
    return await this.cleansingData(summonerName, summoner);
  }

  async refreshSummonerData(
    summonerName: string,
  ): Promise<SummonerAllDataDTO | SummonerDataDTO> {
    const summoner = await this.summonerRepository.findSummoner(summonerName);
    if (!summoner)
      throw new HttpException(
        '갱신할 수 없는 소환사입니다.(DB에 소환사가 없습니다.)',
        HttpStatus.BAD_REQUEST,
      );
    const refreshSummoner = await this.summonerRiotRequest(summonerName);
    await this.summonerRepository.updateSummoner(refreshSummoner);

    return await this.getSummoner(summonerName);
  }

  //라이엇 API 요청, 데이터 저장 API
  async summonerRiotRequest(summonerName: string) {
    try {
      //SUMMONER
      const response = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/ + ${encodeURIComponent(
            summonerName,
          )} + ?api_key=${process.env.RIOT_API_KEY}`,
        )
        .toPromise();

      const { data } = response;
      const summonerId = data.id;
      const puuId = data.puuid;
      const summonerLevel = data.summonerLevel;

      const summonerIcon = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;

      //SUMMONER LEAGUE INFO
      const detailResponse = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${data.id}?api_key=${process.env.RIOT_API_KEY}`,
        )
        .toPromise();

      //SUMMONER CHAMP MASTERY
      const mostChampResponse = await this.axios
        .get(
          `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${data.id}/top?count=3&api_key=${process.env.RIOT_API_KEY}
        `,
        )
        .toPromise();
      const mostChamp = mostChampResponse.data;

      const detailData = detailResponse.data;

      let win: number,
        lose: number,
        winRate: number,
        tier: string,
        rank: string,
        lp: number;

      const soloRankInfo = detailData.find(
        (ele) => ele.queueType === 'RANKED_SOLO_5x5',
      );
      const flexRankInfo = detailData.find(
        (ele) => ele.queueType === 'RANKED_FLEX_SR',
      );

      if (soloRankInfo) {
        win = soloRankInfo.wins;
        lose = soloRankInfo.losses;
        winRate = Math.floor((win / (win + lose)) * 100); // 소수점 버리기
        tier = soloRankInfo.tier;
        rank = soloRankInfo.rank;
        lp = soloRankInfo.leaguePoints;
      } else if (!soloRankInfo && flexRankInfo) {
        win = flexRankInfo.wins;
        lose = flexRankInfo.losses;
        winRate = Math.floor((win / (win + lose)) * 100); // 소수점 버리기
        tier = flexRankInfo.tier;
        rank = flexRankInfo.rank;
        lp = flexRankInfo.leaguePoints;
      } else {
        win = 0;
        lose = 0;
        winRate = 0;
        tier = 'Unranked';
        rank = '';
        lp = 0;
      }

      if (!detailData)
        throw new HttpException(
          '언랭크 소환사 입니다.',
          HttpStatus.BAD_REQUEST,
        );

      let tierImg: string;
      switch (tier) {
        case 'IRON':
          tierImg = 'https://erunjrun.com/tier/Iron.png';
          break;
        case 'BRONZE':
          tierImg = 'https://erunjrun.com/tier/Bronze.png';
          break;
        case 'SILVER':
          tierImg = 'https://erunjrun.com/tier/Silver.png';
          break;
        case 'GOLD':
          tierImg = 'https://erunjrun.com/tier/Gold.png';
          break;
        case 'PLATINUM':
          tierImg = 'https://erunjrun.com/tier/Platinum.png';
          break;
        case 'DIAMOND':
          tierImg = 'https://erunjrun.com/tier/Diamond.png';
          break;
        case 'MASTER':
          tierImg = 'https://erunjrun.com/tier/Master.png';
          break;
        case 'GRANDMASTER':
          tierImg = 'https://erunjrun.com/tier/Grandmaster.png';
          break;
        case 'CHALLENGER':
          tierImg = 'https://erunjrun.com/tier/Challenger.png';
          break;
        case 'Unranked':
          tierImg = '';
          break;
      }
      const summonerData: SummonerRequestDTO = {
        summonerName,
        summonerId,
        summonerIcon,
        summonerLevel,
        tier: tier + ' ' + rank,
        lp,
        tierImg,
        win,
        lose,
        winRate,
        mostChamp1: mostChamp[0].championId,
        mostChamp2: mostChamp[1].championId,
        mostChamp3: mostChamp[2].championId,
      };
      //SUMMONER MATCH ID
      const matchIdResponse = await this.axios
        .get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${process.env.RIOT_API_KEY}
      `,
        )
        .toPromise();

      //유저 최근 전적 요청 부분
      const getSummonerHistory =
        await this.summonerRepository.getSummonerHistory(summonerName);

      if (getSummonerHistory) {
        await this.summonerRepository.deleteSummonerHistory(summonerName);
      }

      for (let m of matchIdResponse.data) {
        //SUMMONER MATCH DATA
        const matchDataResponse = await this.axios
          .get(
            `https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${process.env.RIOT_API_KEY}`,
          )
          .toPromise();

        const matchData = matchDataResponse.data.info;

        let position;

        if (matchData.gameMode === 'CLASSIC') {
          for (let p of matchData.participants) {
            if (p.puuid === puuId) {
              switch (p.teamPosition) {
                case 'TOP':
                  position = 1;
                  break;
                case 'JUNGLE':
                  position = 2;
                  break;
                case 'MIDDLE':
                  position = 3;
                  break;
                case 'BOTTOM':
                  position = 4;
                  break;
                case 'UTILITY':
                  position = 5;
                  break;
              }

              const history = {
                win: p.win,
                kill: p.kills,
                death: p.deaths,
                assist: p.assists,
                champId: p.championId,
                position,
                summonerName: p.summonerName,
                summonerId: p.summonerId,
                matchId: m,
              };
              await this.summonerRepository.createSummonerHistory(history);
            } else {
              continue;
            }
          }
        }
      }
      return summonerData;
    } catch (err) {
      console.log(err);
      if (!err.status) {
        throw new HttpException(err, 500);
      }
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
