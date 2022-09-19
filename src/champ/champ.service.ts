import { Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}

  async getChampList() {
    return await this.champRepository.getChmapList();
  }

  async getTargetChampion(category: string) {
    return await this.champRepository.getTargetChampion(category);
  }
}
