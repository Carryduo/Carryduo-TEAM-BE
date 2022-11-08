import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SimulationService } from '..//simulation.service';
import { SimulationEntity } from '../entities/simulation.entity';
import { SimulationRepository } from '../simulation.repository';
class mockRepository {}
describe('SimulationService', () => {
  let service: SimulationService;
  let repository: SimulationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SimulationService,
        SimulationRepository,
        {
          provide: getRepositoryToken(SimulationEntity),
          useClass: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SimulationService>(SimulationService);
    repository = module.get<SimulationRepository>(SimulationRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
