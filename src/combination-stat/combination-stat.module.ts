import { Module } from '@nestjs/common';
import { CombinationStatController } from './combination-stat.controller';
import { CombinationStatService } from './combination-stat.service';

@Module({
  controllers: [CombinationStatController],
  providers: [CombinationStatService],
})
export class CombinationStatModule {}
