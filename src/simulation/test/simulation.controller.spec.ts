import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SimulationEntity } from '../entities/simulation.entity';
import { SimulationController } from '../simulation.controller';
import { SimulationRepository } from '../simulation.repository';
import { SimulationService } from '../simulation.service';
class mockRepository {}

describe('SimulationController', () => {
  let controller: SimulationController;
  let service: SimulationService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SimulationController],
      providers: [
        SimulationService,
        SimulationRepository,
        {
          provide: getRepositoryToken(SimulationEntity),
          useClass: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<SimulationController>(SimulationController);
    service = module.get<SimulationService>(SimulationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
