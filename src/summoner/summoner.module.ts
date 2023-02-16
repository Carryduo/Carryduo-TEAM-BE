import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampEntity } from '../champ/entities/champ.entity';
import { SummonerHistoryDataCleansing } from './data-cleansing/history.data.cleansing';
import { summonerResponseCleansing } from './data-cleansing/summoner.data.cleansing';
import { SummonerEntity } from './entities/summoner.entity';
import { SummonerHistoryEntity } from './entities/summoner.history.entity';
import { SummonerController } from './summoner.controller';
import { SummonerRepository } from './summoner.repository';
import { SummonerRiotRequest } from './summoner.riot.request';
import { SummonerService } from './summoner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SummonerHistoryEntity,
      SummonerEntity,
      ChampEntity,
    ]),
  ],
  controllers: [SummonerController],
  providers: [SummonerService, SummonerRepository, SummonerRiotRequest],
})
export class SummonerModule {}
