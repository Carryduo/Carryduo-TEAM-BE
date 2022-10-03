import { CombinationStatService } from './combination-stat.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller('combination-stat')
export class CombinationStatController {
  constructor(
    private readonly combinationStatService: CombinationStatService,
  ) {}

  @Get('/:category')
  async getData(@Param('category') category: string) {
    return this.combinationStatService.getCombinationData(category);
  }

  @Get('/champ/:category')
  async getIndividualChampData(@Param('category') category: string) {
    return;
  }
}
