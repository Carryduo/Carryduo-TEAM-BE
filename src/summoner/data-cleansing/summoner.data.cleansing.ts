import { Injectable } from '@nestjs/common';
import { SummonerHistoryResponseDTO } from '../dto/history/history.dto';
import {
  SummonerAllDataDTO,
  SummonerDataDTO,
} from '../dto/summoner/summoner.data.dto';
import { SummonerDBResponseDTO } from '../dto/summoner/summoner.response.dto';
import { SummonerRepository } from '../summoner.repository';

@Injectable()
export class summonerResponseCleansing {
  constructor(private readonly summonerRepository: SummonerRepository) {}

  async responseCleansing(
    summoner: SummonerDBResponseDTO,
    history: SummonerHistoryResponseDTO,
  ): Promise<SummonerAllDataDTO | SummonerDataDTO> {
    {
      if (!history) {
        const summonerData: SummonerDataDTO = {
          summonerName: summoner.summonerName,
          summonerIcon: summoner.summonerIcon,
          summonerLevel: summoner.summonerLevel,
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
        await this.summonerRepository.cacheSummoner(
          summoner.summonerName,
          summonerData,
        );
        return summonerData;
      } else {
        const summonerData: SummonerAllDataDTO = {
          summonerName: summoner.summonerName,
          summonerIcon: summoner.summonerIcon,
          summonerLevel: summoner.summonerLevel,
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
          history,
        };
        await this.summonerRepository.cacheSummoner(
          summoner.summonerName,
          summonerData,
        );
        return summonerData;
      }
    }
  }
}
