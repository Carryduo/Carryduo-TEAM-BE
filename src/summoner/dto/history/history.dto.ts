import { ApiProperty, PickType } from '@nestjs/swagger';
import { SummonerHistoryCommonDTO } from './history.common.dto';

export class SummonerHistoryRequestDTO extends PickType(
  SummonerHistoryCommonDTO,
  [
    'win',
    'kill',
    'death',
    'assist',
    'position',
    'champId',
    'summonerName',
    'summonerId',
    'matchId',
  ],
) {}

/---------------------------------------------------------------------------------------------------------/;

export class RecentChampRate {
  @ApiProperty({
    example: '32',
    description: '첫번째로 많이 한 챔피언 정보',
  })
  recentChamp1: number;

  @ApiProperty({
    example: '5',
    description: '첫번째로 많이 한 챔피언 승 수',
  })
  recentChampWin1: number;

  @ApiProperty({
    example: '5',
    description: '첫번째로 많이 한 챔피언 패 수',
  })
  recentChampLose1: number;

  @ApiProperty({
    example: '50',
    description: '첫번째로 많이 한 챔피언 승률',
  })
  recentChampRate1: number;

  @ApiProperty({
    example: 'example.png',
    description: '첫번째로 많이 한 챔피언 이미지',
  })
  recentChampImg: string;
}

/---------------------------------------------------------------------------------------------------------/;

export class SummonerPosition {
  @ApiProperty({
    example: '10',
    type: Number,
    description: '소환사 포지션 ID',
  })
  id: number;

  @ApiProperty({
    example: '10',
    type: Number,

    description: '소환사 해당 포지션 게임 수 ',
  })
  cnt: number;
}

/---------------------------------------------------------------------------------------------------------/;

export class SummonerHistoryResponseDTO {
  @ApiProperty({
    example: '10',
    description: '소환사 게임 판 수',
    required: true,
  })
  total: number;

  @ApiProperty({
    example: '7',
    description: '소환사 이긴 게임 수',
    required: true,
  })
  win: number;

  @ApiProperty({
    example: '10',
    description: '소환사 진 게임 수',
    required: true,
  })
  lose: number;

  @ApiProperty({
    example: '10',
    description: '소환사 승률',
    required: true,
  })
  winRate: number;

  @ApiProperty({
    description: '소환사 포지션 정보',
    required: true,
    isArray: true,
    type: SummonerPosition,
  })
  positions: SummonerPosition;

  @ApiProperty({
    description: '소환사 최근 많이 한 챔피언 정보',
    required: true,
    isArray: true,
    type: RecentChampRate,
  })
  recentChampRate: RecentChampRate;
}

/---------------------------------------------------------------------------------------------------------/;
