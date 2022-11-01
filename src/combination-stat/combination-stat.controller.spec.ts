import { Test, TestingModule } from '@nestjs/testing';
import { CombinationStatController } from './combination-stat.controller';

describe('CombinationStatService', () => {
  let controller: CombinationStatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CombinationStatController],
    }).compile();

    controller = module.get<CombinationStatController>(
      CombinationStatController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
