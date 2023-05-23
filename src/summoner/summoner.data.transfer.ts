import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateSummonerHistoryDto } from './dto/summoner/history/create.history.dto';
import { SummonerPositionDto } from './dto/summoner/history/history.position.dto';
import { RecentChampDto } from './dto/summoner/history/history.recent.champ.dto';
import {
  SummonerHistoryRateDto,
  SummonerRecordSumData,
} from './dto/summoner/history/history.rate.dto';
import { CreateSummonerDto } from './dto/summoner/create.summoner.dto';
import { MostChampDataDto } from './dto/riot-request-data/most.champ.info.dto';
import { SoloRankDataDto } from './dto/riot-request-data/solo.rank.info.dto';
import { SummonerDataDto } from './dto/riot-request-data/summoner.default.info.dto';
import { SummonerCommonDTO } from './dto/summoner/summoner.common.dto';
import { SummonerEntity } from './entities/summoner.entity';
import { SummonerHistoryResponseDto } from './dto/summoner/history/history.response.dto';
import { SummonerDefaultDataDto } from './dto/summoner/history/history.summoner.dto';
import { SummonerHistoryEntity } from './entities/summoner.history.entity';
import { SummonerRepository } from './summoner.repository';

@Injectable()
export class TransferSummonerData {
  constructor(private readonly summonerRepository: SummonerRepository) {}
  //riot Dto
  async summonerData(data: any): Promise<SummonerDataDto> {
    const summonerId = data.id;
    const summonerPuuId = data.puuid;
    const summonerLevel = data.summonerLevel;
    const summonerIcon = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;
    const summonerName = data.name;
    return plainToInstance(SummonerDataDto, {
      summonerId,
      summonerPuuId,
      summonerLevel,
      summonerIcon,
      summonerName,
    });
  }

  async soloRankData(data: any): Promise<SoloRankDataDto> {
    const tierImgInfo = {
      IRON: 'https://erunjrun.com/tier/Iron.png',
      BRONZE: 'https://erunjrun.com/tier/Bronze.png',
      SILVER: 'https://erunjrun.com/tier/Silver.png',
      GOLD: 'https://erunjrun.com/tier/Gold.png',
      PLATINUM: 'https://erunjrun.com/tier/Platinum.png',
      DIAMOND: 'https://erunjrun.com/tier/Diamond.png',
      MASTER: 'https://erunjrun.com/tier/Master.png',
      GRANDMASTER: 'https://erunjrun.com/tier/Grandmaster.png',
      CHALLENGER: 'https://erunjrun.com/tier/Challenger.png',
      Unranked: '',
    };
    const win = data ? data.wins : 0;
    const lose = data ? data.losses : 0;
    const winRate = data
      ? Math.floor((data.wins / (data.wins + data.losses)) * 100)
      : 0;
    const tier = data ? data.tier + ' ' + data.rank : 'Unranked';
    const tierImg = data ? tierImgInfo[data.tier] : tierImgInfo.Unranked;
    const lp = data ? data.leaguePoints : 0;

    return plainToInstance(SoloRankDataDto, {
      win,
      lose,
      winRate,
      tier,
      tierImg,
      lp,
    });
  }

  async mostChampData(
    mostChamp1: number,
    mostChamp2: number,
    mostChamp3: number,
  ): Promise<MostChampDataDto> {
    mostChamp1 = mostChamp1 ? mostChamp1 : null;
    mostChamp2 = mostChamp2 ? mostChamp2 : null;
    mostChamp3 = mostChamp3 ? mostChamp3 : null;
    return plainToInstance(MostChampDataDto, {
      mostChamp1,
      mostChamp2,
      mostChamp3,
    });
  }

  async summonerEntity(
    summonerDataDto: SummonerDataDto,
    soloRankDataDto: SoloRankDataDto,
    mostChampDataDto: MostChampDataDto,
  ): Promise<SummonerEntity> {
    const summonerResult = plainToInstance(CreateSummonerDto, {
      ...summonerDataDto,
      ...soloRankDataDto,
      ...mostChampDataDto,
    });
    return summonerResult.toEntity();
  }

  async summonerHistoryEntity(
    histories: any,
  ): Promise<SummonerHistoryEntity[]> {
    const positionInfo = {
      1: 'TOP',
      2: 'JUNGLE',
      3: 'MIDDLE',
      4: 'BOTTOM',
      5: 'UTILITY',
    };
    const hitoryDto = histories.map((v: any) => {
      v.win = v.win ? 1 : 0;
      v.position = Number(
        Object.keys(positionInfo).find(
          (key) => positionInfo[key] === v.position,
        ),
      );
      return plainToInstance(CreateSummonerHistoryDto, v);
    });

    return hitoryDto.map((v: CreateSummonerHistoryDto) => v.toEntity());
  }

  //summoner & history Dto
  async summonerDefaultData(
    summoner: SummonerCommonDTO,
  ): Promise<SummonerDefaultDataDto> {
    const summonerDto = plainToInstance(SummonerCommonDTO, summoner);
    const {
      mostChamp1,
      mostChamp2,
      mostChamp3,
      ...summonerDtoWithoutMostChamps
    } = summonerDto;
    const mostChamps = [mostChamp1, mostChamp2, mostChamp3];

    const summonerDefaultData = { ...summonerDtoWithoutMostChamps, mostChamps };
    return plainToInstance(SummonerDefaultDataDto, summonerDefaultData);
  }

  async summonerPosition(
    position: SummonerPositionDto[],
  ): Promise<SummonerPositionDto[]> {
    const positionId = [1, 2, 3, 4, 5];
    const positions: { id: number; cnt: number }[] = [];
    for (const p of position) {
      if (positionId.includes(p.id)) {
        positionId.splice(positionId.indexOf(p.id), 1);
        positions.push({ id: p.id, cnt: Number(p.cnt) });
      }
    }
    for (const pI of positionId) {
      positions.push({ id: pI, cnt: 0 });
    }
    positions.sort((a, b) => a.id - b.id);
    return positions.map((v) => plainToInstance(SummonerPositionDto, v));
  }

  async summonerRecentChamp(
    recentChampInfo: { count: string; champId: string }[],
    summonerId: string,
  ): Promise<RecentChampDto[]> {
    const recentChampInfoList = [];

    for (const r of recentChampInfo) {
      const recentChampRate = await this.summonerRepository.getRecentChampRate(
        r.champId,
        summonerId,
      );
      recentChampInfoList.push({ ...recentChampRate });
    }
    return recentChampInfoList.map((v) => plainToInstance(RecentChampDto, v));
  }

  async summonerHistoryRate(
    recordSum: SummonerRecordSumData,
    summonerPosition: SummonerPositionDto[],
    recentChamps: RecentChampDto[],
  ): Promise<SummonerHistoryRateDto> {
    const kill = Number(
      (Number(recordSum.killCount) / Number(recordSum.totalCount)).toFixed(2),
    );
    const death = Number(
      (Number(recordSum.deathCount) / Number(recordSum.totalCount)).toFixed(2),
    );
    const assist = Number(
      (Number(recordSum.assistCount) / Number(recordSum.totalCount)).toFixed(2),
    );

    const KDA = Number(
      (
        (Number(recordSum.killCount) + Number(recordSum.assistCount)) /
        Number(recordSum.deathCount)
      ).toFixed(2),
    );

    const total = Number(recordSum.totalCount);
    const win = Number(recordSum.winCount);
    const lose = Number(recordSum.totalCount) - Number(recordSum.winCount);
    const winRate = Math.floor(
      (Number(recordSum.winCount) / Number(recordSum.totalCount)) * 100,
    );
    const positions = summonerPosition;
    const recentChamp = recentChamps;

    return plainToInstance(SummonerHistoryRateDto, {
      kill,
      death,
      assist,
      KDA,
      total,
      win,
      lose,
      winRate,
      positions,
      recentChamp,
    });
  }
  async SummonerHistoryResponse(
    summoner: SummonerDefaultDataDto,
    history: SummonerHistoryRateDto,
  ): Promise<SummonerHistoryResponseDto> {
    return plainToInstance(SummonerHistoryResponseDto, {
      ...summoner,
      history,
    });
  }
}
