import {
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from '../common/interceptors/cache.interceptor';
import { HttpExceptionFilter } from '../common/exception/http-exception.filter';
import { TypeOrmFilter } from '../common/exception/typeorm-exception.filter';
import { SummonerService } from './summoner.service';
import { SummonerHistoryResponseDto } from './dto/summoner/history/history.response.dto';
import { ThrottleInterceptor } from '../common/interceptors/throttler.interceptors';

@Controller('summoner')
@ApiTags('Summoner')
@UseFilters(HttpExceptionFilter, TypeOrmFilter)
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({ summary: '소환사 전적 정보 새로고침' })
  @ApiResponse({
    status: 200,
    description: '소환사 전적 정보 새로고침',
    type: SummonerHistoryResponseDto,
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    description: '소환사 이름',
  })
  @UseInterceptors(ThrottleInterceptor)
  @Get('refresh/:summonerName')
  async refreshSummonerInfo(@Param('summonerName') summonerName: string) {
    return await this.summonerService.refreshSummoner(summonerName);
  }

  @ApiOperation({ summary: '소환사 전적 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '소환사 전적 정보 조회',
    type: SummonerHistoryResponseDto,
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    description: '소환사 이름',
  })
  // @UseInterceptors(HttpCacheInterceptor)
  @Get('/:summonerName')
  async summonerInfo(@Param('summonerName') summonerName: string) {
    return await this.summonerService.getSummoner(summonerName);
  }
}
