import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChampEntity } from '../champ/entities/champ.entity';
import { Repository } from 'typeorm';
import { SummonerEntity } from './entities/summoner.entity';
import { SummonerHistoryEntity } from './entities/summoner.history.entity';
import { Cache } from 'cache-manager';
import { SummonerRecordSumData } from './dto/summoner/history/history.rate.dto';
import { RecentChampDto } from './dto/summoner/history/history.recent.champ.dto';
import { SummonerPositionDto } from './dto/summoner/history/history.position.dto';

export class SummonerRepository {
  constructor(
    @InjectRepository(ChampEntity)
    private readonly champRepository: Repository<ChampEntity>,
    @InjectRepository(SummonerEntity)
    private readonly summonerRepository: Repository<SummonerEntity>,
    @InjectRepository(SummonerHistoryEntity)
    private readonly historyRepository: Repository<SummonerHistoryEntity>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // async cacheSummoner(summonerName: string, data: SummonerAllDataDTO | SummonerDataDTO) {
  //   await this.cacheManager.set(`/summoner/${summonerName}`, data);
  // }

  async existSummoner(summonerName: string): Promise<SummonerEntity> {
    return await this.summonerRepository
      .createQueryBuilder()
      .where('summonerName = :summonerName', { summonerName })
      .getOne();
  }

  async getSummoner(summonerName: string): Promise<SummonerEntity> {
    return await this.summonerRepository
      .createQueryBuilder('summoner')
      .leftJoinAndSelect('summoner.mostChamp1', 'most1')
      .leftJoinAndSelect('summoner.mostChamp2', 'most2')
      .leftJoinAndSelect('summoner.mostChamp3', 'most3')
      .select([
        'summoner.summonerName',
        'summoner.summonerIcon',
        'summoner.summonerLevel',
        'summoner.tier',
        'summoner.tierImg',
        'summoner.lp',
        'summoner.win',
        'summoner.lose',
        'summoner.winRate',
        'most1.id',
        'most1.champNameKo',
        'most1.champNameEn',
        'most1.champMainImg',
        'most2.id',
        'most2.champNameKo',
        'most2.champNameEn',
        'most2.champMainImg',
        'most3.id',
        'most3.champNameKo',
        'most3.champNameEn',
        'most3.champMainImg',
      ])
      .where('summoner.summonerName = :summonerName', { summonerName })
      .getOne();
  }

  async getSummonerRecordSum(summonerName: string): Promise<SummonerRecordSumData> {
    return await this.historyRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.summonerName', 'summoner')
      .select('SUM(history.win) winCount')
      .addSelect('SUM(history.kill) killCount')
      .addSelect('SUM(history.death) deathCount ')
      .addSelect('SUM(history.assist) assistCount ')
      .addSelect('COUNT(history.summonerName) totalCount ')
      .where('summoner.summonerName = :summonerName', { summonerName })
      .getRawOne();
  }

  async getSummonerPositionRecord(summonerName: string): Promise<SummonerPositionDto[]> {
    return await this.historyRepository
      .createQueryBuilder()
      .where('summonerName = :summonerName', { summonerName })
      .select(['COUNT(champId) cnt', 'position id'])
      .groupBy('position')
      .orderBy('cnt', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async getRecentChamp(summonerName: string): Promise<{ count: string; champId: string }[]> {
    return await this.historyRepository
      .createQueryBuilder()
      .where('summonerName = :summonerName', { summonerName })
      .select(['COUNT(champId) count', 'champId'])
      .groupBy('champId')
      .orderBy('count', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async getRecentChampRate(champId: string, summonerName: string): Promise<RecentChampDto> {
    return await this.historyRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.champId', 'champ')
      .select([
        'champ.id recentChampId',
        'champ.champNameKo recentChampName',
        'champ.champImg recentChampImg',
      ])
      .addSelect('SUM(CASE WHEN history.win = 1 THEN 1 ELSE 0 END)', 'recentChampWin')
      .addSelect('SUM(CASE WHEN history.win = 0 THEN 1 ELSE 0 END)', 'recentChampLose')
      .addSelect(
        'SUM(CASE WHEN history.win = 0 THEN 1 WHEN history.win = 1 THEN 1 ELSE 0 END)',
        'recentChampTotal',
      )
      .addSelect(
        'SUM(CASE WHEN history.win = 1 THEN 1 ELSE 0 END) / SUM(CASE WHEN history.win = 0 THEN 1 WHEN history.win = 1 THEN 1 ELSE 0 END) * 100',
        'recentChampRate',
      )
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.champId = :champId', { champId })
      .getRawOne();
  }

  async createSummoner(summoner: SummonerEntity) {
    await this.summonerRepository.createQueryBuilder().insert().values(summoner).execute();
  }
  async createSummonerHistory(history: SummonerHistoryEntity[]) {
    return this.historyRepository.createQueryBuilder().insert().values(history).execute();
  }

  async updateSummoner(summoner: SummonerEntity) {
    await this.summonerRepository
      .createQueryBuilder()
      .update(SummonerEntity)
      .set(summoner)
      .where('summonerName = :summonerName', {
        summonerName: summoner.summonerName,
      })
      .execute();
  }

  async deleteSummonerHistory(summonerName: string) {
    return this.historyRepository
      .createQueryBuilder()
      .delete()
      .from(SummonerHistoryEntity)
      .where('summonerName = :summonerName', { summonerName })
      .execute();
  }
}
