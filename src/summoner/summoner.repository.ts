import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SummonerEntity } from './entities/summoner.entity';

export class SummonerRepository {
  constructor(
    @InjectRepository(SummonerEntity)
    private readonly summonerRepository: Repository<SummonerEntity>,
  ) {}
  async summonerInfo(summonerName: string) {}
}
