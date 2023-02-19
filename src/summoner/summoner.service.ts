import { Injectable } from '@nestjs/common';
import { SummonerRepository } from './summoner.repository';
import axios from 'axios';

import { SummonerDtoFactory } from './summoner.dto.factory';
import { ConfigService } from '@nestjs/config';
import { SummonerEntity } from './entities/summoner.entity';

@Injectable()
export class SummonerService {
  constructor(
    private readonly summonerRepository: SummonerRepository,
    private readonly summonerDto: SummonerDtoFactory,
    private readonly configService: ConfigService,
  ) {}

  async getSummoner(summonerName: string) {
    const existSummoner = await this.summonerRepository.existSummoner(summonerName);
    if (!existSummoner) {
      await this.createSummoner(summonerName);
    }
    const summoner = await this.summonerRepository.getSummoner(summonerName);

    return await this.summonerHistoryCalculation(summoner);
  }

  private async summonerHistoryCalculation(summoner: SummonerEntity) {
    const summonerDefaultDataDto = await this.summonerDto.createSummonerDefaultData(summoner);

    const position = await this.summonerRepository.getSummonerPositionRecord(summoner.summonerName);
    const positions = await this.summonerDto.createPosition(position);

    const recentChampInfoList = [];
    const recentChamp = await this.summonerRepository.getRecentChamp(summoner.summonerName);
    for (let r of recentChamp) {
      const recentChampRate = await this.summonerRepository.getRecentChampRate(
        r.champId,
        summoner.summonerName,
      );
      recentChampInfoList.push({ ...recentChampRate });
    }

    const recentChampDto = await this.summonerDto.createRecentChamp(recentChampInfoList);
    const recordSum = await this.summonerRepository.getSummonerRecordSum(summoner.summonerName);

    const historyRateDto = await this.summonerDto.createHistoryRate(
      recordSum,
      positions,
      recentChampDto,
    );

    return await this.summonerDto.createHistoryResponse(summonerDefaultDataDto, historyRateDto);
  }

  private async createSummoner(summonerName: string) {
    const summoner = await this.requestRiotSummonerApi(summonerName);
    const history = await this.requestRiotSummonerHistoryApi(summoner.summonerPuuId);

    await this.summonerRepository.createSummoner(summoner);
    await this.summonerRepository.createSummonerHistory(history);
    return;
  }

  // async refreshSummonerData(summonerName: string): Promise<SummonerAllDataDTO | SummonerDataDTO> {
  //   const summoner = await this.summonerRepository.findSummoner(summonerName);
  //   if (!summoner) throw new HttpException('갱신할 수 없는 소환사입니다.(DB에 소환사가 없습니다.)', HttpStatus.BAD_REQUEST);
  //   const refreshSummoner = await this.summonerRiotRequest(summonerName);
  //   await this.summonerRepository.updateSummoner(refreshSummoner);

  //   return await this.getSummoner(summonerName);
  // }

  private async requestRiotSummonerApi(summonerName: string) {
    //SUMMONER
    const response = await axios.get(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
        summonerName,
      )}?api_key=${this.configService.get('RIOT_API_KEY')}`,
    );
    const { data } = response;
    const summonerDataDto = await this.summonerDto.createSummoner(data);

    //SUMMONER LEAGUE INFO
    const detailResponse = await axios.get(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${
        summonerDataDto.summonerId
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

    const soloRankDataDto = await this.summonerDto.createSoloRank(summonerLeagueInfo);

    //SUMMONER CHAMP MASTERY
    const mostChampResponse = await axios.get(
      `https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${
        summonerDataDto.summonerId
      }/top?count=3&api_key=${this.configService.get('RIOT_API_KEY')}`,
    );
    const mostChamp = mostChampResponse.data;

    const mostChampDataDto = await this.summonerDto.createMostChamp(
      mostChamp[0].championId,
      mostChamp[1].championId,
      mostChamp[2].championId,
    );

    const summonerDtoToEntity = await this.summonerDto.createSummonerToEntity(
      summonerDataDto,
      soloRankDataDto,
      mostChampDataDto,
    );
    return summonerDtoToEntity;
  }

  async requestRiotSummonerHistoryApi(puuId: string) {
    //matchId 10개
    const matchIdResponse = await axios.get(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuId}/ids?start=0&count=10&api_key=${this.configService.get(
        'RIOT_API_KEY',
      )}`,
    );
    const summonerHistoryList = [];

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
            summonerHistoryList.push(history);
          }
        }
      }
    }
    const summonerHistoryDtoToEntity = await this.summonerDto.createSummonerHistory(
      summonerHistoryList,
    );
    return summonerHistoryDtoToEntity;
  }
}
