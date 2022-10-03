import { CombinationStatService } from './combination-stat.service';
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import {
  IndividualChampDataParamPipe,
  TierListParamPipe,
} from './pipes/combination-stat.param.validator.pipe';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  IndiviudalChampResponseDto,
  TierListResponseDto,
} from './dtos/combination-stat.response.dto';

@ApiTags('Combination-stat')
@Controller('combination-stat')
export class CombinationStatController {
  constructor(
    private readonly combinationStatService: CombinationStatService,
  ) {}

  // TODO: 카테고리 validator

  @ApiOperation({ summary: '라인별 Top30 티어리스트 조회' })
  @ApiParam({
    name: 'category',
    required: true,
    description: '라인 분류',
    example: 'top-jungle/mid-jungle/ad-support',
  })
  @ApiResponse({
    status: 200,
    description: '개인 챔피언의 조합승률 TOP 5 조회 성공',
    type: TierListResponseDto,
  })
  @Get('/:category')
  async getTierList(
    @Param('category', TierListParamPipe) category: string,
  ): Promise<TierListResponseDto[]> {
    return this.combinationStatService.getCombinationData(category);
  }

  // TODO: 유효한 ChampId가 아닐 경우에 대한 404 예외처리
  @ApiOperation({ summary: '개인 챔피언의 조합승률 TOP 5 조회' })
  @ApiParam({
    name: 'category',
    required: true,
    description: '챔피언 ID',
    example: 117,
  })
  @ApiParam({
    name: 'position',
    required: true,
    description: '챔피언의 라인',
    example: 'top/jungle/mid/ad/support',
  })
  @ApiResponse({
    status: 200,
    description: '개인 챔피언의 조합승률 TOP 5 조회 성공',
    type: IndiviudalChampResponseDto,
  })
  @Get('/champ/:category/:position')
  async getIndividualChampData(
    @Param('category', ParseIntPipe) category: string,
    @Param('position', IndividualChampDataParamPipe) position: string,
  ): Promise<
    IndiviudalChampResponseDto[] | { result: any[]; message: string }
  > {
    return this.combinationStatService.getIndiviualChampData(
      category,
      position,
    );
  }
}
