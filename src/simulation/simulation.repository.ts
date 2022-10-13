import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SimulationEntity } from './entities/simulation.entity';

@Injectable()
export class SimulationRepository {
  constructor(
    @InjectRepository(SimulationEntity)
    private readonly simulationRepository: Repository<SimulationEntity>,
  ) {}

  async getSimulationData(category: string | number, option1, option2) {
    return await this.simulationRepository
      .createQueryBuilder('SIMULATION')
      .leftJoinAndSelect('SIMULATION.champ1Id', 'champ1')
      .leftJoinAndSelect('SIMULATION.champ2Id', 'champ2')
      .leftJoinAndSelect('SIMULATION.champ3Id', 'champ3')
      .leftJoinAndSelect('SIMULATION.champ4Id', 'champ4')
      .select([
        'SIMULATION.id',
        'SIMULATION.createdAt',
        'SIMULATION.updatedAt',
        'SIMULATION.category',
        'SIMULATION.winrate',
        'SIMULATION.sampleNum',

        'champ1.id',
        'champ1.champNameKo',
        'champ1.champNameEn',
        'champ1.champImg',

        'champ2.id',
        'champ2.champNameKo',
        'champ2.champNameEn',
        'champ2.champImg',

        'champ3.id',
        'champ3.champNameKo',
        'champ3.champNameEn',
        'champ3.champImg',

        'champ4.id',
        'champ4.champNameKo',
        'champ4.champNameEn',
        'champ4.champImg',
      ])
      .where('SIMULATION.category = :category', { category })
      .orWhere(option1)
      .orWhere(option2)
      .getOne();
  }
}
