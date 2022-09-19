import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SummonerService } from './summoner.service';

@Controller('summoner')
@ApiTags('Summoner')
export class SummonerController {
  constructor(private readonly summonerService: SummonerService) {}

  @Get('/:summonerName')
  async summonerInfo(@Param('summonerName') summonerName: string) {
    return await this.summonerService.summonerInfo(summonerName);
  }
}
