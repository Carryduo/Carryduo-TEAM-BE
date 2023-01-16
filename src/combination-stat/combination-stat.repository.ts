import { CombinationStatCommonDto } from './dtos/combination-stat.common.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CombinationStatEntity } from './entities/combination-stat.entity';

@Injectable()
export class CombinationStatRepository {
  constructor(
    @InjectRepository(CombinationStatEntity)
    private readonly combinationStatRepository: Repository<CombinationStatEntity>,
  ) {}

  async getVersions(): Promise<{ version: string }[]> {
    return await this.combinationStatRepository.createQueryBuilder('COMBINATION_STAT').select(['DISTINCT COMBINATION_STAT.version']).getRawMany();
  }
  //   mainPage 티어리스트
  async getTierList(category: string | number, version): Promise<CombinationStatCommonDto[]> {
    return await this.combinationStatRepository
      .createQueryBuilder('COMBINATION_STAT')
      .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
      .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
      .select([
        'COMBINATION_STAT.id as id',
        'COMBINATION_STAT.createdAt as createdAt',
        'COMBINATION_STAT.updatedAt as updatedAt',
        'COMBINATION_STAT.category as category',
        'COMBINATION_STAT.sampleNum as sampleNum',
        'COMBINATION_STAT.version as version',
        'champ1.id as champ1_id',
        'champ1.champNameKo as champ1_champNameKo',
        'champ1.champNameEn as champ1_champNameEn',
        'champ1.champImg as champ1_champImg',
        'champ2.id as champ2_id',
        'champ2.champNameKo as champ2_champNameKo',
        'champ2.champNameEn as champ2_champNameEn',
        'champ2.champImg as champ2_champImg',
        'COMBINATION_STAT.win/COMBINATION_STAT.sample_num as winrate',
        '((COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 0.4 + ((COMBINATION_STAT.sample_num - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) / ((SELECT MAX(sample_num) FROM COMBINATION_STAT) - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) * 0.6 )) * 5  AS opScore',
      ])
      .where('COMBINATION_STAT.category = :category', { category })
      .andWhere('COMBINATION_STAT.version = :version', { version })
      .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
      .orderBy({ '((COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 0.4 + ((COMBINATION_STAT.sample_num - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) / ((SELECT MAX(sample_num) FROM COMBINATION_STAT) - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) * 0.6 )) * 5': 'DESC' })
      .limit(30)
      .getRawMany<CombinationStatCommonDto>();
  }

  async getIndividualChampData(option: { category: Brackets; champ: Brackets }, version: string): Promise<CombinationStatCommonDto[]> {
    // 탑, 미드, 원딜
    return await this.combinationStatRepository
      .createQueryBuilder('COMBINATION_STAT')
      .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
      .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
      .select([
        'COMBINATION_STAT.id as id',
        'COMBINATION_STAT.createdAt as createdAt',
        'COMBINATION_STAT.updatedAt as updatedAt ',
        'COMBINATION_STAT.category as category',
        'COMBINATION_STAT.sampleNum as sampleNum',
        'COMBINATION_STAT.version as version',
        'champ1.id as champ1_id',
        'champ1.champNameKo as champ1_champNameKo',
        'champ1.champNameEn as champ1_champNameEn',
        'champ1.champImg as champ1_champImg',
        'champ2.id as champ2_id',
        'champ2.champNameKo as champ2_champNameKo',
        'champ2.champNameEn as champ2_champNameEn',
        'champ2.champImg as champ2_champImg',
        'COMBINATION_STAT.win/COMBINATION_STAT.sample_num as winrate',
        '((COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 0.4 + ((COMBINATION_STAT.sample_num - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) / ((SELECT MAX(sample_num) FROM COMBINATION_STAT) - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) * 0.6 )) * 5  AS opScore',
      ])
      .where(option.category)
      .andWhere(option.champ)
      .andWhere('COMBINATION_STAT.version = :version', { version })
      .andWhere('COMBINATION_STAT.sampleNum >= :sampleNum', { sampleNum: 5 })
      .orderBy({ '((COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 0.4 + ((COMBINATION_STAT.sample_num - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) / ((SELECT MAX(sample_num) FROM COMBINATION_STAT) - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) * 0.6 )) * 5': 'DESC' })
      .limit(5)
      .getRawMany<CombinationStatCommonDto>();
  }

  getMainpageData = async (version: string): Promise<{ category0: number; category1: number; category2: number }> => {
    try {
      const category0 = await this.combinationStatRepository
        .createQueryBuilder('COMBINATION_STAT')
        .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
        .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
        .select()
        .where('COMBINATION_STAT.category = :category', { category: 0 })
        .andWhere('COMBINATION_STAT.version = :version', { version })
        .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
        .orderBy({ '((COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 0.4 + ((COMBINATION_STAT.sample_num - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) / ((SELECT MAX(sample_num) FROM COMBINATION_STAT) - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) * 0.6 )) * 5': 'DESC' })
        .getCount();
      const category1 = await this.combinationStatRepository
        .createQueryBuilder('COMBINATION_STAT')
        .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
        .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
        .select()
        .where('COMBINATION_STAT.category = :category', { category: 1 })
        .andWhere('COMBINATION_STAT.version = :version', { version })
        .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
        .orderBy({ '((COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 0.4 + ((COMBINATION_STAT.sample_num - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) / ((SELECT MAX(sample_num) FROM COMBINATION_STAT) - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) * 0.6 )) * 5': 'DESC' })
        .getCount();
      const category2 = await this.combinationStatRepository
        .createQueryBuilder('COMBINATION_STAT')
        .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
        .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
        .select()
        .where('COMBINATION_STAT.category = :category', { category: 2 })
        .andWhere('COMBINATION_STAT.version = :version', { version })
        .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
        .orderBy({ '((COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 0.4 + ((COMBINATION_STAT.sample_num - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) / ((SELECT MAX(sample_num) FROM COMBINATION_STAT) - (SELECT MIN(sample_num) FROM COMBINATION_STAT)) * 0.6 )) * 5': 'DESC' })
        .getCount();
      return { category0, category1, category2 };
    } catch (err) {
      console.log(err);
      return;
    }
  };
}
