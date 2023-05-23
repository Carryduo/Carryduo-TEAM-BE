import { CombinationStatService } from './combination-stat.service';
import { Controller, Get, Param } from '@nestjs/common';
import {
  IndividualChampParamPipe,
  CategoryParamPipe,
} from './pipes/combination-stat.param.validator.pipe';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CategoryParamDto,
  IndividualChampParamDto,
} from './dtos/combination-stat.request.dto';
import {
  IndividualChampResponseDto,
  TierListResponseDto,
  VersionResponseDto,
} from './dtos/combination-stat.response.dto';

@ApiTags('Combination-stat')
@Controller('combination-stat')
export class CombinationStatController {
  constructor(
    private readonly combinationStatService: CombinationStatService,
  ) {}

  @ApiOperation({ summary: '현재 데이터의 패치버전' })
  @ApiResponse({
    status: 200,
    description: '현재 데이터의 패치버전 응답 성공',
    type: VersionResponseDto,
  })
  @Get('/version')
  async getRecentVersion(): Promise<VersionResponseDto> {
    return await this.combinationStatService.getRecentVersion();
  }

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
    @Param(CategoryParamPipe) param: CategoryParamDto,
  ): Promise<TierListResponseDto[]> {
    return this.combinationStatService.getTierList(
      param.toTierListRequestDto(),
    );
  }

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
    type: IndividualChampResponseDto,
  })
  @Get('/champ/:category/:position')
  async getIndividualChampData(
    @Param(IndividualChampParamPipe) param: IndividualChampParamDto,
  ): Promise<
    IndividualChampResponseDto[] | { result: any[]; message: string }
  > {
    return this.combinationStatService.getIndiviualChampData(
      param.toIndividualChampRequestDto(),
    );
  }
}
