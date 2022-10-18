import { SimulationRepository } from './simulation.repository';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';

@Injectable()
export class SimulationService {
  constructor(private readonly simulationRepository: SimulationRepository) {}
  async getSimulationData(
    category: string | number,
    champ1Id: string | number,
    champ2Id: string | number,
    champ3Id: string | number,
    champ4Id: string | number,
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

    const option = new Brackets((qb) => {
      qb.where('SIMULATION.category = :category', {
        category,
      })
        .andWhere('SIMULATION.champ1Id = :champ1Id', {
          champ1Id,
        })
        .andWhere('SIMULATION.champ2Id = :champ2Id', {
          champ2Id,
        })
        .andWhere('SIMULATION.champ3Id = :champ3Id', {
          champ3Id,
        })
        .andWhere('SIMULATION.champ4Id = :champ4Id', {
          champ4Id,
        });
    });

    const reverseOption = new Brackets((qb) => {
      qb.where('SIMULATION.category = :category', {
        category,
      })
        .andWhere('SIMULATION.champ1Id = :champ3Id', {
          champ3Id,
        })
        .andWhere('SIMULATION.champ2Id = :champ4Id', {
          champ4Id,
        })
        .andWhere('SIMULATION.champ3Id = :champ1Id', {
          champ1Id,
        })
        .andWhere('SIMULATION.champ4Id = :champ2Id', {
          champ2Id,
        });
    });

    let data = await this.simulationRepository.getSimulationData(option);
    if (!data) {
      data = await this.simulationRepository.getSimulationData(reverseOption);
    }
    if (!data) {
      return data;
    }
    const champ1 = data.champ1Id;
    const champ2 = data.champ2Id;
    if (champ1Id === data.champ3Id.id) {
      data.winrate = Number(((1 - data.winrate) * 100).toFixed(2));
      data.champ1Id = data.champ3Id;
      data.champ2Id = data.champ4Id;
      data.champ3Id = champ1;
      data.champ4Id = champ2;
    } else {
      data.winrate = Number((data.winrate * 100).toFixed(2));
    }
    if (data.winrate > 50) {
      data.winrate = 0;
    } else if (data.winrate === 50) {
      data.winrate = 1;
    } else {
      data.winrate = 2;
    }
    return data;
  }
}
