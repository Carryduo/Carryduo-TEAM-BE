import { TierListParamPipe } from './../combination-stat/pipes/combination-stat.param.validator.pipe';
import { SimulationService } from './simulation.service';
import { Body, Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { simulationBodyDto } from './dto/simulation.request.dto';
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
  @Get('/:category')
  getSimulationData(
    @Param('category', TierListParamPipe) category: string,
    @Body() body: simulationBodyDto,
  ): Promise<simulationResponseDto> {
    const { champ1Id, champ2Id, champ3Id, champ4Id } = body;
    return this.simulaitionService.getSimulationData(
      category,
      champ1Id,
      champ2Id,
      champ3Id,
      champ4Id,
    );
  }
}
