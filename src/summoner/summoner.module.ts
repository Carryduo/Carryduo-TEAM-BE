import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampEntity } from '../champ/entities/champ.entity';
import { SummonerEntity } from './entities/summoner.entity';
import { SummonerHistoryEntity } from './entities/summoner.history.entity';
import { SummonerController } from './summoner.controller';
import { SummonerDtoFactory } from './summoner.dto.factory';
import { SummonerRepository } from './summoner.repository';
import { SummonerService } from './summoner.service';

@Module({
  imports: [TypeOrmModule.forFeature([SummonerHistoryEntity, SummonerEntity, ChampEntity])],
  controllers: [SummonerController],
  providers: [SummonerService, SummonerRepository, SummonerDtoFactory],
})
export class SummonerModule {}
