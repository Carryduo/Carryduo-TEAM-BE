import { Test, TestingModule } from '@nestjs/testing';
import { ChampService } from './champ.service';

describe('ChampService', () => {
  let service: ChampService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChampService],
    }).compile();

    service = module.get<ChampService>(ChampService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
