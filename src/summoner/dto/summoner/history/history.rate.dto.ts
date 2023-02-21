import { ApiProperty, PickType } from '@nestjs/swagger';
import { SummonerHistoryCommonDto } from './history.common.dto';
import { SummonerPositionDto } from './history.position.dto';
import { RecentChampDto } from './history.recent.champ.dto';

export class SummonerRecordSumData {
  winCount: string;
  killCount: string;
  deathCount: string;
  assistCount: string;
  totalCount: string;
}

export class SummonerHistoryRateDto extends PickType(SummonerHistoryCommonDto, [
  'win',
  'kill',
  'death',
  'assist',
]) {
  @ApiProperty({
    example: '2.8',
    description: '소환사 KDA',
    required: true,
  })
  readonly KDA: number;

  @ApiProperty({
    example: '10',
    description: '소환사 게임 판 수',
    required: true,
  })
  readonly total: number;

  @ApiProperty({
    example: '5',
    description: '소환사 진 게임 수',
    required: true,
  })
  readonly lose: number;

  @ApiProperty({
    example: '50',
    description: '소환사 승률',
    required: true,
  })
  readonly winRate: number;

  @ApiProperty({
    description: '소환사 포지션 정보',
    required: true,
    isArray: true,
    type: SummonerPositionDto,
  })
  readonly positions: SummonerPositionDto[];

  @ApiProperty({
    description: '소환사 최근 많이 한 챔피언 정보',
    required: true,
    isArray: true,
    type: RecentChampDto,
  })
  readonly recentChamp: RecentChampDto[];
}
