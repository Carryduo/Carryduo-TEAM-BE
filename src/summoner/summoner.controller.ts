import { Controller, Get, Param, UseFilters, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { SummonerResponseDTO } from './dto/summoner/summoner.dto';
import { SummonerService } from './summoner.service';

@Controller('summoner')
@ApiTags('Summoner')
@UseFilters(HttpExceptionFilter)
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @ApiOperation({ summary: '소환사 전적 정보 새로고침' })
  @ApiResponse({
    status: 200,
    description: '소환사 전적 정보 새로고침',
    type: SummonerResponseDTO,
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    description: '소환사 이름',
  })
  @UseGuards(ThrottlerGuard)
  @Get('refresh/:summonerName')
  async refreshSummonerInfo(@Param('summonerName') summonerName: string) {
    return await this.summonerService.RefreshSummoner(summonerName);
  }

  @ApiOperation({ summary: '소환사 전적 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '소환사 전적 정보 조회',
    type: SummonerResponseDTO,
  })
  @ApiParam({
    name: 'summonerName',
    required: true,
    description: '소환사 이름',
  })
  @Get('/:summonerName')
  async summonerInfo(@Param('summonerName') summonerName: string) {
    return await this.summonerService.getSummoner(summonerName);
  }
}
