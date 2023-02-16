import { Injectable } from '@nestjs/common';
import {
  RecentChampRate,
  SummonerHistoryResponseDTO,
  SummonerPosition,
} from '../dto/history/history.dto';
import { SummonerRepository } from '../summoner.repository';

@Injectable()
export class SummonerHistoryDataCleansing {
  constructor(private readonly summonerRepository: SummonerRepository) {}

  async historyDataCleansing(summonerName: string): Promise<SummonerHistoryResponseDTO> {
    // // const check = await this.summonerRepository.getSummonerHistory(
    //   summonerName,
    // );

    // if (!check) {
    //   return;
    // }

    const winInfo = await this.summonerRepository.sumWin(summonerName);

    const recentChampsList = []; //10경기 중 많이 플레이 한 챔피언 리스트

    const recentChamps = await this.summonerRepository.recentChamp(summonerName);

    for (let r of recentChamps) {
      recentChampsList.push(r.history_champ_id);
    }

    let recentChampRates: RecentChampRate[] = [];

    for (let rc of recentChampsList) {
      const recentChampInfo = await this.summonerRepository.recentChampInfo(rc);

      const recentChampRateInfo = await this.summonerRepository.recentChampRate(summonerName, rc);

      //이기거나 진 카운트가 없으면 champId는 undifined가 돼서 champId 따로 추가
      if (!recentChampRateInfo.win.history_champ_id) {
        recentChampRateInfo.win.history_champ_id = rc;
      } else if (!recentChampRateInfo.lose.history_champ_id) {
        recentChampRateInfo.lose.history_champ_id = rc;
      }

      const recentChamp = recentChampRateInfo.win.history_champ_id;
      const recentChampWin = Number(recentChampRateInfo.win.winCnt);
      const recentChampLose = Number(recentChampRateInfo.lose.loseCnt);
      const recentChampTotal = recentChampWin + recentChampLose;
      const recentChampRate = (recentChampWin / recentChampTotal) * 100;

      recentChampRates.push({
        recentChampId: recentChamp,
        recentChampImg: recentChampInfo.champ_champ_img,
        recentChampName: recentChampInfo.champ_champ_name_ko,
        recentChampWin,
        recentChampLose,
        recentChampTotal,
        recentChampRate: Number(recentChampRate.toFixed(2)),
      });
    }

    /*탑:1, 정글:2 미드:3, 원딜:4, 서포터:5 */
    const positionId = [1, 2, 3, 4, 5];

    const positions: SummonerPosition[] = [];

    for (let pI of positionId) {
      const position = await this.summonerRepository.position(summonerName, pI);
      //해당 positionId가 없으면 임의로 positionId와 0 을 넣어준다.
      if (!position) {
        positions.push({
          id: pI,
          cnt: 0,
        });
      } else if (position) {
        //해당 positionId가 있으면 해당 포지션과 positionId의 합을 넣어준다.
        positions.push({
          id: Number(position.history_position),
          cnt: Number(position.positionCnt),
        });
      }
    }

    const kdaInfo = await this.summonerRepository.kdaAverage(summonerName);
    const kill = Number(kdaInfo.killSum);
    const death = Number(kdaInfo.deathSum);
    const assist = Number(kdaInfo.assistSum);

    const kdaAverage = (kill + assist) / death;
    const killAver = kill / 10;
    const deathAver = death / 10;
    const assiAver = assist / 10;

    const rate = {
      kill: killAver,
      death: deathAver,
      assist: assiAver,
      KDA: Number(kdaAverage.toFixed(2)),
      total: Number(winInfo.totalCnt),
      win: Number(winInfo.winCnt),
      lose: Number(winInfo.totalCnt) - Number(winInfo.winCnt),
      winRate: Math.floor((Number(winInfo.winCnt) / Number(winInfo.totalCnt)) * 100),
      positions,
      recentChampRate: recentChampRates,
    };

    return rate;
  }
}
