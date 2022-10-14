import { TierListParamPipe } from './../combination-stat/pipes/combination-stat.param.validator.pipe';
import { SimulationService } from './simulation.service';
import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  HttpException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { simulationResponseDto } from './dto/simulation.response.dto';

@Controller('simulation')
@ApiTags('simulation')
@UseFilters(HttpExceptionFilter)
export class SimulationController {
  constructor(private readonly simulaitionService: SimulationService) {}

  @ApiOperation({ summary: '대전 시뮬레이션 조회' })
  @ApiParam({
    name: 'category',
    required: true,
    description: '대전 시뮬레이션 기준',
    example: 'top-jungle, mid-jungle, ad-support',
  })
  @ApiResponse({
    status: 200,
    description: '대전 시뮬레이션 응답 예시',
    type: simulationResponseDto,
  })
  @ApiQuery({
    name: 'champ1Id',
    required: true,
    description: '팀A champ1 고유 ID',
    example: '56',
  })
  @ApiQuery({
    name: 'champ2Id',
    required: true,
    description: '팀A champ1 고유 ID',
    example: '56',
  })
  @ApiQuery({
    name: 'champ3Id',
    required: true,
    description: '팀A champ1 고유 ID',
    example: '56',
  })
  @ApiQuery({
    name: 'champ4Id',
    required: true,
    description: '팀A champ1 고유 ID',
    example: '56',
  })
  @Get('/:category')
  getSimulationData(
    @Param('category', TierListParamPipe) category: string,
    @Query('champ1Id') champ1Id: string,
    @Query('champ2Id') champ2Id: string,
    @Query('champ3Id') champ3Id: string,
    @Query('champ4Id') champ4Id: string,
  ): Promise<simulationResponseDto> {
    if (
      isNaN(Number(champ1Id)) ||
      isNaN(Number(champ2Id)) ||
      isNaN(Number(champ3Id)) ||
      isNaN(Number(champ4Id))
    ) {
      throw new HttpException(`champId는 숫자형태여야 합니다.`, 400);
    }
    return this.simulaitionService.getSimulationData(
      category,
      champ1Id,
      champ2Id,
      champ3Id,
      champ4Id,
    );
  }
}
