import { CombinationStatRepositoryRawQueryDto, CombinationStatRepositoryVersionResponseDto } from './dtos/combination-stat.repository.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CombinationStatEntity } from './entities/combination-stat.entity';

@Injectable()
// TODO: 각 출력값은 각 DTO에 감싸기
export class CombinationStatRepository {
  constructor(
    @InjectRepository(CombinationStatEntity)
    private readonly combinationStatRepository: Repository<CombinationStatEntity>,
  ) {}

  async getVersions(): Promise<CombinationStatRepositoryVersionResponseDto[]> {
    const data = await this.combinationStatRepository.createQueryBuilder('COMBINATION_STAT').select(['DISTINCT COMBINATION_STAT.version']).getRawMany();
    return data.map((value) => {
      return new CombinationStatRepositoryVersionResponseDto(value);
    });
  }
  //   mainPage 티어리스트
  async getTierList(requestOption: { category: number; version: string }): Promise<CombinationStatRepositoryRawQueryDto[]> {
    const { category, version } = requestOption;
    const data = await this.combinationStatRepository
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
      .getRawMany();
    return data.map((value) => {
      return new CombinationStatRepositoryRawQueryDto(value);
    });
  }

  async getIndividualChampData(requestOption: { option: { category: Brackets; champ: Brackets }; version: string }): Promise<CombinationStatRepositoryRawQueryDto[]> {
    // 탑, 미드, 원딜
    const { option, version } = requestOption;
    const data = await this.combinationStatRepository
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
      .getRawMany();

    return data.map((value) => {
      value = new CombinationStatRepositoryRawQueryDto(value);
      return value;
    });
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
