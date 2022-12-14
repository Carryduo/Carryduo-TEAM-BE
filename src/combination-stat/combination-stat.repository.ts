import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CombinationStatCommonDto } from './dtos/combination-stat.common.dto';
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
  async getTierList(category, version): Promise<CombinationStatCommonDto[]> {
    const data = await this.combinationStatRepository
      .createQueryBuilder('COMBINATION_STAT')
      .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
      .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
      .select(['COMBINATION_STAT.id', 'COMBINATION_STAT.createdAt', 'COMBINATION_STAT.updatedAt', 'COMBINATION_STAT.category', 'COMBINATION_STAT.win', 'COMBINATION_STAT.sampleNum', 'COMBINATION_STAT.version', 'champ1.id', 'champ1.champNameKo', 'champ1.champNameEn', 'champ1.champImg', 'champ2.id', 'champ2.champNameKo', 'champ2.champNameEn', 'champ2.champImg'])
      .where('COMBINATION_STAT.category = :category', { category })
      .andWhere('COMBINATION_STAT.version = :version', { version })
      .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
      .orderBy({ '(COMBINATION_STAT.sample_num) * 0.3 + (COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 100 * 0.7': 'DESC' })
      .limit(30)
      .getMany();
    return data;
  }

  async getIndividualChampData(option, version): Promise<CombinationStatCommonDto[] | any[]> {
    // 탑, 미드, 원딜
    return await this.combinationStatRepository
      .createQueryBuilder('COMBINATION_STAT')
      .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
      .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
      .select(['COMBINATION_STAT.id', 'COMBINATION_STAT.createdAt', 'COMBINATION_STAT.updatedAt', 'COMBINATION_STAT.category', 'COMBINATION_STAT.win', 'COMBINATION_STAT.sampleNum', 'COMBINATION_STAT.version', 'champ1.id', 'champ1.champNameKo', 'champ1.champNameEn', 'champ1.champImg', 'champ2.id', 'champ2.champNameKo', 'champ2.champNameEn', 'champ2.champImg'])
      .where(option.category)
      .andWhere(option.champ)
      .andWhere('COMBINATION_STAT.version = :version', { version })
      .andWhere('COMBINATION_STAT.sampleNum >= :sampleNum', { sampleNum: 5 })
      .orderBy({ '(COMBINATION_STAT.sample_num) * 0.3 + (COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 100 * 0.7': 'DESC' })
      .limit(5)
      .getMany();
  }

  getMainpageData = async (version) => {
    try {
      const category0 = await this.combinationStatRepository
        .createQueryBuilder('COMBINATION_STAT')
        .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
        .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
        .select()
        .where('COMBINATION_STAT.category = :category', { category: 0 })
        .andWhere('COMBINATION_STAT.version = :version', { version })
        .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
        .orderBy({ '(COMBINATION_STAT.sample_num) * 0.3 + (COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 100 * 0.7': 'DESC' })
        .limit(30)
        .getMany();
      const category1 = await this.combinationStatRepository
        .createQueryBuilder('COMBINATION_STAT')
        .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
        .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
        .select()
        .where('COMBINATION_STAT.category = :category', { category: 1 })
        .andWhere('COMBINATION_STAT.version = :version', { version })
        .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
        .orderBy('COMBINATION_STAT.win/COMBINATION_STAT.sample_num', 'DESC')
        .limit(30)
        .getMany();
      const category2 = await this.combinationStatRepository
        .createQueryBuilder('COMBINATION_STAT')
        .leftJoinAndSelect('COMBINATION_STAT.mainChampId', 'champ1')
        .leftJoinAndSelect('COMBINATION_STAT.subChampId', 'champ2')
        .select()
        .where('COMBINATION_STAT.category = :category', { category: 2 })
        .andWhere('COMBINATION_STAT.version = :version', { version })
        .andWhere('COMBINATION_STAT.sample_num >= :sampleNum', { sampleNum: 30 })
        .orderBy({ '(COMBINATION_STAT.sample_num) * 0.3 + (COMBINATION_STAT.win/COMBINATION_STAT.sample_num) * 100 * 0.7': 'DESC' })
        .limit(30)
        .getMany();
      return { category0: category0.length, category1: category1.length, category2: category2.length };
    } catch (err) {
      console.log(err);
      return;
    }
  };
}
