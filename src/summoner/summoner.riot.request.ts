import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeagueEntryDTO, SoloRankDataDto } from './dto/riot-api/solo.rank.info.dto';
import { MostChampDataDto } from './dto/riot-api/most.champ.info.dto';
import { SummonerDataDto } from './dto/riot-api/summoner.default.info.dto';
import { plainToInstance } from 'class-transformer';
import { CreateSummonerHistoryDto } from './dto/history/create.summoner.history';
import { CreateSummonerDto } from './dto/riot-api/create.summoner.dto';

@Injectable()
export class SummonerRiotRequest {
  constructor(private readonly configService: ConfigService) {}

  async requestRiotSummonerApi(summonerName: string) {
    //SUMMONER
    const response = await axios.get(`https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}?api_key=${this.configService.get('RIOT_API_KEY')}`);
    const { data } = response;
    const summonerDataDto = plainToInstance(SummonerDataDto, data);

    //SUMMONER LEAGUE INFO
    const detailResponse = await axios.get(`https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerDataDto.summonerId}?api_key=${this.configService.get('RIOT_API_KEY')}`);
    let summonerLeagueInfo = detailResponse?.data;

    summonerLeagueInfo = summonerLeagueInfo.filter((v: LeagueEntryDTO) => v.queueType === 'RANKED_SOLO_5x5');

    if (summonerLeagueInfo.length === 0) {
      //summonerLeagueData에 RANKED_SOLO_5x5 기록이 없는 경우
      summonerLeagueInfo = null;
    } else {
      summonerLeagueInfo = summonerLeagueInfo[0];
    }

    //summonerLeagueDataDto를 soloRankDataDto로 변경
    const soloRankDataDto = SoloRankDataDto.plainToSoloRankDataDto(summonerLeagueInfo);

    // //SUMMONER CHAMP MASTERY
    const mostChampResponse = await axios.get(`https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerDataDto.summonerId}/top?count=3&api_key=${this.configService.get('RIOT_API_KEY')}`);
    const mostChamp = mostChampResponse.data;

    const mostChampDataDto = plainToInstance(MostChampDataDto, {
      mostChamp1: mostChamp[0].championId,
      mostChamp2: mostChamp[1].championId,
      mostChamp3: mostChamp[2].championId,
    });

    const createSummonerDto = plainToInstance(CreateSummonerDto, {
      ...summonerDataDto,
      ...mostChampDataDto,
      ...soloRankDataDto,
    });
    return createSummonerDto.toEntity();
  }

  async requestRiotSummonerHistoryApi(summonerName: string, puuId: string) {
    //matchId 10개 받기
    try {
      const matchIdResponse = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${this.configService.get('RIOT_API_KEY')}`);
      const summonerHistoryList = [];

      for (let m of matchIdResponse.data) {
        //SUMMONER MATCH DATA
        const matchDataResponse = await axios.get(`https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${this.configService.get('RIOT_API_KEY')}`);
        const matchDataInfo = matchDataResponse.data.info;

        if (matchDataInfo.gameMode === 'CLASSIC') {
          for (let p of matchDataInfo.participants) {
            if (p.puuid === puuId && p.teamPosition) {
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
              summonerHistoryList.push(history);
            }
          }
        }
      }
      const summonerHistoryDto = summonerHistoryList.map((v) => plainToInstance(CreateSummonerHistoryDto, v));

      return summonerHistoryDto.map((v) => v.toEntity());
      // }
    } catch (err) {
      console.log(err);
    }
  }
}
