import { CombinationStatService } from './combination-stat.service';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  IndividualChampDataParamPipe,
  TierListParamPipe,
} from './pipes/combination-stat.param.validator.pipe';

@Controller('combination-stat')
export class CombinationStatController {
  constructor(
    private readonly combinationStatService: CombinationStatService,
  ) {}

  // TODO: 카테고리 validator
  @Get('/:category')
  async getTierList(@Param('category', TierListParamPipe) category: string) {
    return this.combinationStatService.getCombinationData(category);
  }

  // TODO: 유효한 ChampId가 아닐 경우에 대한 404 예외처리
  @Get('/champ/:category/:position')
  async getIndividualChampData(
    @Param('category', ParseIntPipe) category: string,
    @Param('position', IndividualChampDataParamPipe) position: string,
  ) {
    return this.combinationStatService.getIndiviualChampData(
      category,
      position,
    );
  }
}
