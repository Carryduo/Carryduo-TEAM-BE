import { Module } from '@nestjs/common';
import { ChampController } from './champ.controller';
import { ChampService } from './champ.service';

@Module({
  controllers: [ChampController],
  providers: [ChampService]
})
export class ChampModule {}
