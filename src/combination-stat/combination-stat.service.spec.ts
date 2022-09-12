import { Test, TestingModule } from '@nestjs/testing';
import { CombinationStatService } from './combination-stat.service';

describe('CombinationStatService', () => {
  let service: CombinationStatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CombinationStatService],
    }).compile();

    service = module.get<CombinationStatService>(CombinationStatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
