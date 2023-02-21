import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { SummonerHistoryRateDto } from './history.rate.dto';
import { SummonerDefaultDataDto } from './history.summoner.dto';

export class SummonerHistoryResponseDto extends SummonerDefaultDataDto {
  @ApiProperty({
    description: '소환사 최근 10경기 데이터',
    required: true,
    isArray: true,
    type: SummonerHistoryRateDto,
  })
  readonly history: SummonerHistoryRateDto;
}
