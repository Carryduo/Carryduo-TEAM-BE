import { SimulationRepository } from './simulation.repository';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class SimulationService {
  constructor(private readonly simulationRepository: SimulationRepository) {}
  async getSimulationData(
    category: string | number,
    champ1Id,
    champ2Id,
    champ3Id,
    champ4Id,
  ) {
    switch (category) {
      case 'top-jungle':
        category = 0;
        break;
      case 'mid-jungle':
        category = 1;
        break;
      case 'ad-support':
        category = 2;
        break;
    }

    const option1 = new Brackets((qb) => {
      qb.where('SIMULATION.champ1Id = :champ1Id', {
        champ1Id,
      }).andWhere('SIMULATION.champ2Id = :champ2Id', {
        champ2Id,
      });
    });
    const option2 = new Brackets((qb) => {
      qb.where('SIMULATION.champ3Id = :champ3Id', {
        champ3Id,
      }).andWhere('SIMULATION.champ4Id = :champ4Id', {
        champ4Id,
      });
    });
    const data = await this.simulationRepository.getSimulationData(
      category,
      option1,
      option2,
    );
    const champ1 = data.champ1Id;
    const champ2 = data.champ2Id;
    if (champ1Id === Number(data.champ3Id.id)) {
      data.winrate = Number(((1 - data.winrate) * 100).toFixed(2));
      data.champ1Id = data.champ3Id;
      data.champ2Id = data.champ4Id;
      data.champ3Id = champ1;
      data.champ4Id = champ2;
    } else {
      data.winrate = Number((data.winrate * 100).toFixed(2));
    }
    return data;
  }
}
