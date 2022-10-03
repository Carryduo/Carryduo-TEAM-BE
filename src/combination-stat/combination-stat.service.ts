import { CombinationStatRepository } from './combination-stat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CombinationStatService {
  constructor(
    private readonly combinationStatRepository: CombinationStatRepository,
  ) {}

  async getCombinationData(category) {
    if (isNaN(category)) {
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
      return await this.combinationStatRepository.getTierList(category);
    } else if (!isNaN(category)) {
      // 포지션별로 나눠서 데이터 뿌리기

      return this.combinationStatRepository.getIndividualChampData(category);
    }
  }
}
