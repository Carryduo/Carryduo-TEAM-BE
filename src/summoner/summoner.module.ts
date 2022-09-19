import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonerEntity } from './entities/summoner.entity';
import { SummonerController } from './summoner.controller';
import { SummonerRepository } from './summoner.repository';
import { SummonerService } from './summoner.service';

@Module({
  imports: [TypeOrmModule.forFeature([SummonerEntity])],
  controllers: [SummonerController],
  providers: [SummonerService, SummonerRepository],
})
export class SummonerModule {}
