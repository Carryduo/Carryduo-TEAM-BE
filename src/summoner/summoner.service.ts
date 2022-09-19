import { Injectable } from '@nestjs/common';
import { SummonerRepository } from './summoner.repository';

@Injectable()
export class SummonerService {
  constructor(private readonly summonerRepository: SummonerRepository) {}

  async summonerInfo(summonerName: string) {
    return await this.summonerRepository.summonerInfo(summonerName);
  }
}
