import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpCacheInterceptor } from 'src/common/cache-interceptor/cache.interceptor';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { TypeOrmFilter } from 'src/common/exception/typeorm-exception.filter';
import { SummonerAllDataDTO } from './dto/summoner/summoner.data.dto';
import { SummonerService } from './summoner.service';

@Controller('summoner')
@ApiTags('Summoner')
@UseFilters(HttpExceptionFilter, TypeOrmFilter)
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({ summary: '소환사 전적 정보 새로고침' })
  @ApiResponse({
    status: 200,
    description: '소환사 전적 정보 새로고침',
    type: SummonerAllDataDTO,
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    description: '소환사 이름',
  })
  @Get('refresh/:summonerName')
  async refreshSummonerInfo(@Param('summonerName') summonerName: string) {
    return await this.summonerService.refreshSummonerData(summonerName);
  }
  @ApiOperation({ summary: '소환사 전적 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '소환사 전적 정보 조회',
    type: SummonerAllDataDTO,
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    description: '소환사 이름',
  })
  @UseInterceptors(HttpCacheInterceptor)
  @Get('/:summonerName')
  async summonerInfo(@Param('summonerName') summonerName: string) {
    return await this.summonerService.getSummoner(summonerName);
  }
}
