import { CombinationStatRepository } from './combination-stat.repository';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CombinationStatController } from './combination-stat.controller';
import { CombinationStatService } from './combination-stat.service';
import { CombinationStatEntity } from './entities/combination-stat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CombinationStatEntity]),
    ConfigModule.forRoot(),
  ],
  controllers: [CombinationStatController],
  providers: [CombinationStatService, CombinationStatRepository],
})
export class CombinationStatModule {}
