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

export class RecentChampRate {
  @ApiProperty({
    example: '32',
    description: '최근 플레이 챔피언 정보',
  })
  recentChamp: number;

  @ApiProperty({
    example: 'example.png',
    description: '최근 플레이 챔피언 이미지',
  })
  recentChampImg: string;

  @ApiProperty({
    example: '5',
    description: '최근 플레이 챔피언 승 수',
  })
  recentChampWin: number;

  @ApiProperty({
    example: '5',
    description: '최근 플레이 챔피언 패 수',
  })
  recentChampLose: number;

  @ApiProperty({
    example: '10',
    description: '챔피언으로 플레이한 게임 수',
  })
  recentChampTotal: number;

  @ApiProperty({
    example: '50',
    description: '최근 플레이 챔피언 승률',
  })
  recentChampRate: number;
}

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

export class SummonerHistoryResponseDTO {
  @ApiProperty({
    example: '2.8',
    description: '소환사 KDA',
    required: true,
  })
  KDA: number;

  @ApiProperty({
    example: '10',
    description: '소환사 게임 판 수',
    required: true,
  })
  total: number;

  @ApiProperty({
    example: '5',
    description: '소환사 이긴 게임 수',
    required: true,
  })
  win: number;

  @ApiProperty({
    example: '5',
    description: '소환사 진 게임 수',
    required: true,
  })
  lose: number;

  @ApiProperty({
    example: '50',
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
