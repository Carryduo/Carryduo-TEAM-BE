import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CombinationStatEntity } from './entities/combination-stat.entity';

@Injectable()
export class CombinationStatRepository {
  constructor(
    @InjectRepository(CombinationStatEntity)
    private readonly combinationStatRepository: Repository<CombinationStatEntity>,
  ) {}

  //   mainPage 티어리스트
  async getTierList(category) {
    const data = await this.combinationStatRepository
      .createQueryBuilder('COMBINATION_STAT')
      .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
      .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
      .select([
        'COMBINATION_STAT.id',
        'COMBINATION_STAT.createdAt',
        'COMBINATION_STAT.updatedAt',
        'COMBINATION_STAT.category',
        'COMBINATION_STAT.tier',
        'COMBINATION_STAT.winrate',
        'COMBINATION_STAT.sampleNum',
        'champ1.id',
        'champ1.champNameKo',
        'champ1.champNameEn',
        'champ1.champImg',
        'champ2.id',
        'champ2.champNameKo',
        'champ2.champNameEn',
        'champ2.champImg',
      ])
      .where('COMBINATION_STAT.category = :category', { category })
      .andWhere('COMBINATION_STAT.rankInCategory != :rankInCategory', {
        rankInCategory: 0,
      })
      .orderBy({ 'COMBINATION_STAT.rank_in_category': 'ASC' })
      .limit(30)
      .getMany();
    return data;
  }

  //   챔피언 상세페이지 TOP 5 데이터
  //   TODO: 멀티 포지션에 대한 분기
  //   TODO: 표본 수에 대한 예외처리
  async getIndividualChampData(option) {
    // 탑, 미드, 원딜
    return await this.combinationStatRepository
      .createQueryBuilder('COMBINATION_STAT')
      .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
      .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
      .select([
        'COMBINATION_STAT.id',
        'COMBINATION_STAT.createdAt',
        'COMBINATION_STAT.updatedAt',
        'COMBINATION_STAT.category',
        'COMBINATION_STAT.winrate',
        'COMBINATION_STAT.sampleNum',
        'champ1.id',
        'champ1.champNameKo',
        'champ1.champNameEn',
        'champ1.champImg',
        'champ2.id',
        'champ2.champNameKo',
        'champ2.champNameEn',
        'champ2.champImg',
      ])
      .where(option.category)
      .andWhere(option.champ)
      .andWhere('COMBINATION_STAT.sampleNum >= :sampleNum', {
        sampleNum: 5,
      })
      .orderBy({ 'COMBINATION_STAT.winRate': 'DESC' })
      .limit(5)
      .getMany();
  }
}