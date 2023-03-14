import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SummonerRepository } from './summoner.repository';
import axios from 'axios';

import { TransferSummonerData } from './summoner.data.transfer';
import { ConfigService } from '@nestjs/config';
import { SummonerCommonDTO } from './dto/summoner/summoner.common.dto';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerRepository: SummonerRepository,
    private readonly transfer: TransferSummonerData,
    private readonly configService: ConfigService,
  ) {}

  async getSummoner(summonerName: string) {
    try {
      const existSummoner = await axios.get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          summonerName,
        )}?api_key=${this.configService.get('RIOT_API_KEY')}`,
      );
      const existDbSummoner = await this.summonerRepository.existSummoner(existSummoner.data.name);

      if (!existDbSummoner) {
        await this.createSummoner(existSummoner.data.name);
      }

      const summoner = await this.summonerRepository.getSummoner(existSummoner.data.name);
      return await this.summonerHistoryCalculation(summoner);
    } catch (err) {
      throw new HttpException(`${err.response.statusText} - from getSummoner`, err.response.status);
    }
  }

  async summonerHistoryCalculation(summoner: SummonerCommonDTO) {
    try {
      const summonerDefaultData = await this.transfer.summonerDefaultData(summoner);
      const recordSumInfo = await this.summonerRepository.getSummonerRecordSum(summoner.summonerId);

      const positionInfo = await this.summonerRepository.getSummonerPositionRecord(
        summoner.summonerId,
      );
      const position = await this.transfer.summonerPosition(positionInfo);

      const recentChampInfo = await this.summonerRepository.getRecentChamp(summoner.summonerId);
      const recentChamp = await this.transfer.summonerRecentChamp(
        recentChampInfo,
        summoner.summonerId,
      );

      const historyRate = await this.transfer.summonerHistoryRate(
        recordSumInfo,
        position,
        recentChamp,
      );

      return await this.transfer.SummonerHistoryResponse(summonerDefaultData, historyRate);
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }

  async createSummoner(summonerName: string) {
    try {
      const summoner = await this.requestRiotSummonerApi(summonerName);
      const history = await this.requestRiotSummonerHistoryApi(summoner.summonerPuuId);

      await this.summonerRepository.createSummoner(summoner);
      await this.summonerRepository.createSummonerHistory(history);
      return;
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }

  async refreshSummoner(summonerName: string) {
    try {
      const existSummoner = await this.summonerRepository.existSummoner(summonerName);
      if (!existSummoner) {
        throw new HttpException(
          '갱신할 수 없는 소환사입니다.(DB에 소환사가 없습니다.)',
          HttpStatus.BAD_REQUEST,
        );
      }
      const currentTime = new Date();
      const daysElapsed =
        (currentTime.getTime() - existSummoner.updatedAt.getTime()) / (1000 * 3600 * 24);
      if (daysElapsed > 7) {
        const updateSummoner = await this.requestRiotSummonerApi(summonerName);
        await this.summonerRepository.updateSummoner(updateSummoner);
      }
      await this.summonerRepository.deleteSummonerHistory(existSummoner.summonerId);

      const newHistory = await this.requestRiotSummonerHistoryApi(existSummoner.summonerPuuId);

      await this.summonerRepository.createSummonerHistory(newHistory);

      const summoner = await this.summonerRepository.getSummoner(summonerName);

      return await this.summonerHistoryCalculation(summoner);
    } catch (err) {
      throw new HttpException(err, 400);
    }
  }

  async requestRiotSummonerApi(summonerName: string) {
    try {
      //SUMMONER
      const response = await axios.get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
          summonerName,
        )}?api_key=${this.configService.get('RIOT_API_KEY')}`,
      );
      const { data } = response;
      const summoner = await this.transfer.summonerData(data);

      //SUMMONER LEAGUE INFO
      const detailResponse = await axios.get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${
          summoner.summonerId
        }?api_key=${this.configService.get('RIOT_API_KEY')}`,
      );
      let summonerLeagueInfo = detailResponse?.data;

      summonerLeagueInfo = summonerLeagueInfo.filter((v: any) => v.queueType === 'RANKED_SOLO_5x5');

      if (summonerLeagueInfo.length === 0) {
        //summonerLeagueData에 RANKED_SOLO_5x5 기록이 없는 경우
        summonerLeagueInfo = null;
      } else {
        summonerLeagueInfo = summonerLeagueInfo[0];
      }

      const soloRank = await this.transfer.soloRankData(summonerLeagueInfo);

      //SUMMONER CHAMP MASTERY
      const mostChampResponse = await axios.get(
        `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${
          summoner.summonerId
        }/top?count=3&api_key=${this.configService.get('RIOT_API_KEY')}`,
      );
      const mostChampData = mostChampResponse.data;

      const mostChamps = await this.transfer.mostChampData(
        mostChampData[0].championId,
        mostChampData[1].championId,
        mostChampData[2].championId,
      );

      const summonerEntity = await this.transfer.summonerEntity(summoner, soloRank, mostChamps);

      return summonerEntity;
    } catch (err) {
      throw new HttpException(
        `${err.response.statusText} - from requestRiotSummonerApi`,
        err.response.status,
      );
    }
  }

  async requestRiotSummonerHistoryApi(puuId: string) {
    try {
      //matchId 10개
      const matchIdResponse = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${this.configService.get(
          'RIOT_API_KEY',
        )}`,
      );
      const summonerHistoryArr = [];

      for (let m of matchIdResponse.data) {
        //SUMMONER MATCH DATA
        const matchDataResponse = await axios.get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/${m}?api_key=${this.configService.get(
            'RIOT_API_KEY',
          )}`,
        );

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
              summonerHistoryArr.push(history);
            }
          }
        }
      }
      const summonerHistoryList = await this.transfer.summonerHistoryEntity(summonerHistoryArr);
      return summonerHistoryList;
    } catch (err) {
      throw new HttpException(
        `${err.response.statusText} - from requestRiotSummonerHistoryApi`,
        err.response.status,
      );
    }
  }
}
