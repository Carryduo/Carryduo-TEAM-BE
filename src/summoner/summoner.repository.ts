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
    const summoner = this.summonerRepository
      .createQueryBuilder('summoner')
      .leftJoinAndSelect('summoner.mostChamp1', 'most1')
      .leftJoinAndSelect('summoner.mostChamp2', 'most2')
      .leftJoinAndSelect('summoner.mostChamp3', 'most3')
      .where('summonerName = :summonerName', { summonerName })
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
        'most1.champImg',
        'most2.id',
        'most2.champNameKo',
        'most2.champNameEn',
        'most2.champImg',
        'most3.id',
        'most3.champNameKo',
        'most3.champNameEn',
        'most3.champImg',
      ])
      .getRawOne();

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

  async getMatchId(summonerName: string) {
    return this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .select('history.matchId')
      .orderBy('history.createdAt', 'ASC')
      .limit(10)
      .execute();
  }

  async sumWin(matchIds, summonerName: string) {
    const totalCnt = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .getCount();

    const { winCnt } = await this.historyRepository
      .createQueryBuilder('history')
      .select('SUM(history.win)', 'winCnt')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .getRawOne();
    return { totalCnt, winCnt };
  }

  async recentChamp(summonerName: string, matchIds) {
    return await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .select('history.champId')
      .addSelect('COUNT(*) AS champCnt')
      .groupBy('history.champId')
      .having('COUNT(*) > :count', { count: 0 })
      .orderBy('champCnt', 'DESC')
      .limit(3)
      .getRawMany();
  }

  async position(summonerName: string, matchIds) {
    return await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .select('history.position')
      .addSelect('COUNT(*) AS positionCnt')
      .groupBy('history.position')
      .having('COUNT(*) > :count', { count: 0 })
      .orderBy('positionCnt', 'DESC')
      .getRawMany();
  }

  async recentChampRate(summonerName: string, champId: number, matchIds) {
    const win = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.champId = :champId', {
        champId,
      })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .select('history.champId')
      .addSelect('COUNT(*) AS winCnt')
      .andWhere('history.win  = :win', { win: 1 })
      .getRawOne();

    const lose = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.champId = :champId', {
        champId,
      })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .select('history.champId')
      .addSelect('COUNT(*) AS loseCnt')
      .andWhere('history.win = :lose', { lose: 0 })
      .getRawOne();

    return { win, lose };
  }

  async champImg(champId: number) {
    return await this.champRepository
      .createQueryBuilder('champ')
      .where('champ.id = :champId', { champId })
      .select('champ.champImg')
      .getRawOne();
  }

  async beforeMatchId(summonerId: string) {
    return this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerId = :summonerId', { summonerId })
      .getRawMany();
  }

  async kdaAverage(summonerName: string, matchIds) {
    const kill = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .select('SUM(history.kill)', 'killSum')
      .getRawOne();

    const death = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .select('SUM(history.death)', 'deathSum')
      .getRawOne();

    const assist = await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .andWhere('history.matchId IN (:...matchIds)', { matchIds })
      .select('SUM(history.assist)', 'assistSum')
      .getRawOne();
    return { kill, death, assist };
  }

  async getSummoner(summonerName) {
    return await this.historyRepository
      .createQueryBuilder('history')
      .where('history.summonerName = :summonerName', { summonerName })
      .getRawOne();
  }
}
