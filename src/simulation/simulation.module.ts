import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationEntity } from './entities/simulation.entity';
import { SimulationController } from './simulation.controller';
import { SimulationRepository } from './simulation.repository';
import { SimulationService } from './simulation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SimulationEntity]),
    ConfigModule.forRoot(),
  ],
  controllers: [SimulationController],
  providers: [SimulationService, SimulationRepository],
})
export class SimulationModule {}
