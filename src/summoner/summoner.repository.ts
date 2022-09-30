import { InjectRepository } from '@nestjs/typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { Repository } from 'typeorm';
import { SummonerHistoryRequestDTO } from './dto/history/history.dto';
import { SummonerRequestDTO } from './dto/summoner/summoner.dto';
import { SummonerEntity } from './entities/summoner.entity';
import { SummonerHistoryEntity } from './entities/summoner.history.entity';

export class SummonerRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
    @InjectRepository(SummonerEntity)
    private readonly summonerRepository: Repository<SummonerEntity>,
    @InjectRepository(SummonerHistoryEntity)
    private readonly historyRepository: Repository<SummonerHistoryEntity>,
  ) {}

  async findSummoner(summonerName: string) {
    const summoner = this.summonerRepository.findOne({
      where: {
        summonerName,
      },
    });
    return summoner;
  }

  async insertSummoner(summonerInfo: SummonerRequestDTO) {
    return await this.summonerRepository
      .createQueryBuilder()
      .insert()
      .into(SummonerEntity)
      .values(summonerInfo)
      .execute();
  }

  async updateSummoner(summonerInfo: SummonerRequestDTO) {
    return this.summonerRepository
      .createQueryBuilder()
      .update(SummonerEntity)
      .set(summonerInfo)
      .where('summonerName=:summonerName', {
        summonerName: summonerInfo.summonerName,
      })
      .execute();
  }

  async createSummonerHistory(data: SummonerHistoryRequestDTO) {
    return this.historyRepository
      .createQueryBuilder()
      .insert()
      .into(SummonerHistoryEntity)
      .values({
        win: data.win,
        kill: data.kill,
        death: data.death,
        assist: data.assist,
        champId: data.champId,
        position: data.position,
        summonerName: data.summonerName,
        summonerId: data.summonerId,
        matchId: data.matchId,
      })
      .execute();
  }

  async getSummonerHisory(summonerName: string) {
    return this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .getRawMany();
  }

  async sumWin(summonerName: string) {
    const totalCnt = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .getCount();

    const { winCnt } = await this.historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.win)', 'winCnt')
      .where('history.summonerName = :summonerName', { summonerName })
      .getRawOne();
    return { totalCnt, winCnt };
  }

  async recentChamp(summonerName) {
    return await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .select('history.champId')
      .addSelect('COUNT(*) AS champCnt')
      .groupBy('history.champId')
      .having('COUNT(*) > :count', { count: 0 })
      .orderBy('champCnt', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async position(summonerName) {
    return await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .select('history.position')
      .addSelect('COUNT(*) AS positionCnt')
      .groupBy('history.position')
      .having('COUNT(*) > :count', { count: 0 })
      .orderBy('positionCnt', 'DESC')
      .getRawMany();
  }

  async recentChampRate(summonerName, recentChampsList) {
    const win = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.champId IN (:...champIds)', {
        champIds: recentChampsList,
      })
      .select('history.champId')
      .addSelect('COUNT(*) AS winCnt')
      .groupBy('history.win')
      .having('history.win  = :win', { win: 1 })
      .getRawMany();

    const lose = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.champId IN (:...champIds)', {
        champIds: recentChampsList,
      })
      .select('history.champId')
      .addSelect('COUNT(*) AS loseCnt')
      .groupBy('history.win')
      .having('history.win = :lose', { lose: 0 })
      .getRawMany();

    return { win, lose };
  }

  // async recentChampRate1(summonerName, recentChampsList) {
  //   const winCnt1 = await this.historyRepository
  //     .createQueryBuilder('history')
  //     .where('history.summonerName = :summonerName', { summonerName })
  //     .andWhere('history.champId = :champId', {
  //       champId: recentChampsList,
  //     })
  //     .andWhere('history.win = :win', { win: 1 })
  //     .select('history.champId')
  //     .getCount();

  //   const loseCnt1 = await this.historyRepository
  //     .createQueryBuilder('history')
  //     .where('history.summonerName = :summonerName', { summonerName })
  //     .andWhere('history.champId = :champId', {
  //       champId: recentChampsList,
  //     })
  //     .andWhere('history.win = :win', { win: 0 })
  //     .select('history.champId')
  //     .getCount();
  //   return { winCnt1, loseCnt1 };
  // }

  // async recentChampRate2(summonerName, recentChampsList) {
  //   const winCnt2 = await this.historyRepository
  //     .createQueryBuilder('history')
  //     .where('history.summonerName = :summonerName', { summonerName })
  //     .andWhere('history.champId = :champId', {
  //       champId: recentChampsList,
  //     })
  //     .andWhere('history.win = :win', { win: 1 })
  //     .select('history.champId')
  //     .getCount();

  //   const loseCnt2 = await this.historyRepository
  //     .createQueryBuilder('history')
  //     .where('history.summonerName = :summonerName', { summonerName })
  //     .andWhere('history.champId = :champId', {
  //       champId: recentChampsList,
  //     })
  //     .andWhere('history.win = :win', { win: 0 })
  //     .select('history.champId')
  //     .getCount();
  //   return { winCnt2, loseCnt2 };
  // }

  // async recentChampRate3(summonerName, recentChampsList) {
  //   const winCnt3 = await this.historyRepository
  //     .createQueryBuilder('history')
  //     .where('history.summonerName = :summonerName', { summonerName })
  //     .andWhere('history.champId = :champId', {
  //       champId: recentChampsList,
  //     })
  //     .andWhere('history.win = :win', { win: 1 })
  //     .select('history.champId')
  //     .getCount();

  //   const loseCnt3 = await this.historyRepository
  //     .createQueryBuilder('history')
  //     .where('history.summonerName = :summonerName', { summonerName })
  //     .andWhere('history.champId = :champId', {
  //       champId: recentChampsList,
  //     })
  //     .andWhere('history.win = :win', { win: 0 })
  //     .select('history.champId')
  //     .getCount();
  //   return { winCnt3, loseCnt3 };
  // }

  async champImg(champIds) {
    console.log(champIds);
    return await this.champRepository
      .createQueryBuilder('champ')
      .where('champ.id IN (:...champIds)', { champIds })
      .select('champ.champImg')
      .getRawMany();
  }

  async beforeMatchId(summonerId: string) {
    return this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerId = :summonerId', { summonerId })
      .getRawMany();
  }
}
