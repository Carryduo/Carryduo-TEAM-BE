import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { LeagueEntryDTO, SoloRankDataDto } from './dto/riot-api/solo.rank.info.dto';
import { MostChampDataDto } from './dto/riot-api/most.champ.info.dto';
import { SummonerDataDto } from './dto/riot-api/summoner.default.info.dto';
import { plainToInstance } from 'class-transformer';
import { SummonerHistoryDTO } from './dto/riot-api/match.info.dto';
import { createSummonerDto } from './dto/riot-api/create.summoner.dto';
config();

const configService = new ConfigService();
@Injectable()
export class RequestSummonerRiotAPI {
  private readonly summonerName: string;
  constructor(summonerName: string) {
    this.summonerName = summonerName;
  }
  async requestRiotSummonerApi() {
    //   //SUMMONER
    const response = await axios.get(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
        this.summonerName,
      )}?api_key=${configService.get('RIOT_API_KEY')}`,
    );
    const { data } = response;
    const summonerDataResult = SummonerDataDto.transformSummonerDataDto(data);

    //SUMMONER LEAGUE INFO
    const detailResponse = await axios.get(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerDataResult.summonerId}?api_key=${process.env.RIOT_API_KEY}`,
    );
    const summonerLeagueInfo = detailResponse?.data;
    const summonerLeagueData =
      summonerLeagueInfo.length !== 0
        ? summonerLeagueInfo.filter((v: LeagueEntryDTO) => v.queueType === 'RANKED_SOLO_5x5')
        : null;
    //summonerLeagueData에 RANKED_SOLO_5x5 기록이 없는 경우
    const soloRankData = summonerLeagueData.length === 0 ? null : summonerLeagueData;
    const soloRankDataResult = SoloRankDataDto.transformSoloRankData(soloRankData);

    // //SUMMONER CHAMP MASTERY
    const mostChampResponse = await axios.get(
      `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerDataResult.summonerId}/top?count=3&api_key=${process.env.RIOT_API_KEY}`,
    );
    const mostChamp = mostChampResponse.data;
    const mostChampDataResult = MostChampDataDto.transformMostChampData(mostChamp);
    const createSummoner = new createSummonerDto(
      summonerDataResult,
      soloRankDataResult,
      mostChampDataResult,
    );
    console.log(createSummoner.toEntity());
    await this.requestRiotSummonerHistoryApi(this.summonerName, summonerDataResult.puuId);

    // return await this.requestRiotSummonerHistoryApi(this.summonerName, summonerDataResult.puuId);
  }

  async requestRiotSummonerHistoryApi(summonerName: string, puuId: string) {
    //matchId 10개 받기
    try {
      const matchIdResponse = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=1&api_key=${process.env.RIOT_API_KEY}`,
      );

      //유저 최근 전적 요청 부분
      // const getSummonerHistory = await this.summonerRepository.getSummonerHistory(summonerName);

      // if (getSummonerHistory) {
      //   await this.summonerRepository.deleteSummonerHistory(summonerName);
      // }

      for (let m of matchIdResponse.data) {
        //SUMMONER MATCH DATA
        const matchDataResponse = await axios.get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${process.env.RIOT_API_KEY}`,
        );

        const matchData = matchDataResponse.data.info;

        if (matchData.gameMode === 'CLASSIC') {
          for (let p of matchData.participants) {
            if (!p.teamPosition) continue;
            if (p.puuid === puuId) {
              const history = {
                win: p.win,
                kill: p.kills,
                death: p.deaths,
                assist: p.assists,
                champId: p.championId,
                position: p.teamPosition,
                summonerName: p.summonerName,
                summonerId: p.summonerId,
                matchId: m,
              };
              const summonerHistoryResult = plainToInstance(SummonerHistoryDTO, history);
              console.log(summonerHistoryResult);
              // await this.summonerRepository.createSummonerHistory(history);
            } else {
              continue;
            }
          }
        }

        return;
      }
    } catch (err) {
      return err;
    }
  }
}
const request = new RequestSummonerRiotAPI('hide on bush');
request.requestRiotSummonerApi();
