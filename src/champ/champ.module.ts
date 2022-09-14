import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChampController } from './champ.controller';
import { ChampRepository } from './champ.repository';
import { ChampService } from './champ.service';
import { ChampEntity } from './entities/champ.entity';
import { ChampSkillInfoEntity } from './entities/champSkillInfo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChampEntity, ChampSkillInfoEntity]),
    HttpModule,
  ],
  controllers: [ChampController],
  providers: [ChampService, ChampRepository],
})
export class ChampModule {}
