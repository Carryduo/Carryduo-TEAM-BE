import { CombinationStatRepository } from './combination-stat.repository';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class CombinationStatService {
  constructor(
    private readonly combinationStatRepository: CombinationStatRepository,
  ) {}

  async getCombinationData(category: string | number) {
    switch (category) {
      case 'top-jungle':
        category = 0;
        break;
      case 'mid-jungle':
        category = 1;
        break;
      case 'ad-support':
        category = 2;
        break;
    }
    const data = await this.combinationStatRepository.getTierList(category);
    data.map((value) => {
      value.winrate = Number((value.winrate * 100).toFixed(2));
      return value;
    });
    return data;
  }

  async getIndiviualChampData(champId: string, position: string) {
    let option;
    switch (position) {
      case 'top':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 0,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.mainChampId = :mainChampId', {
              mainChampId: champId,
            });
          }),
        };
        break;
      case 'jungle':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 0,
            }).orWhere('COMBINATION_STAT.category = :category2', {
              category2: 1,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.subChampId = :subChampId', {
              subChampId: champId,
            });
          }),
        };
        break;
      case 'mid':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 1,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.mainChampId = :mainChampId', {
              mainChampId: champId,
            });
          }),
        };
        break;
      case 'ad':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 2,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.mainChampId = :mainChampId', {
              mainChampId: champId,
            });
          }),
        };
        break;
      case 'support':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 2,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.subChampId = :subChampId', {
              subChampId: champId,
            });
          }),
        };
        break;
    }
    const dataList =
      await this.combinationStatRepository.getIndividualChampData(option);
    const result = [];
    if (dataList.length !== 0) {
      for (const data of dataList) {
        if (position === 'jungle' || position === 'support') {
          data.subChampId = data.mainChampId;
          data.winrate = Number((data.winrate * 100).toFixed(2));
          delete data.mainChampId;
          result.push(data);
        } else {
          data.winrate = Number((data.winrate * 100).toFixed(2));
          delete data.mainChampId;
          result.push(data);
        }
      }
    } else {
      return { result, message: '유효한 데이터(표본 5 이상)가 없습니다' };
    }
    return result;
  }
}
