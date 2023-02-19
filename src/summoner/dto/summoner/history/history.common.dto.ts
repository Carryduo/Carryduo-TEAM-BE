import { ApiProperty } from '@nestjs/swagger';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';

export class SummonerHistoryCommonDto {
  @ApiProperty({
    example: 5,
    description: '소환사 이긴 게임 수',
    required: true,
  })
  readonly win: number;

  @ApiProperty({
    example: '5',
    description: '소환사 킬 수',
    required: true,
  })
  readonly kill: number;

  @ApiProperty({
    example: '5',
    description: '소환사 데스 수',
    required: true,
  })
  readonly death: number;

  @ApiProperty({
    example: '5',
    description: '소환사 어시스트 수',
    required: true,
  })
  readonly assist: number;

  @ApiProperty({
    example: '5',
    description: '소환사 플레이 포지션',
    required: true,
  })
  readonly position: number;

  @ApiProperty({
    example: 'uuid',
    description: '소환사 id',
    required: true,
  })
  readonly summonerId: string;

  @ApiProperty({
    example: 'uuid',
    description: '소환사 플레이 경기 id',
    required: true,
  })
  readonly matchId: string;

  @ApiProperty({
    example: '할배탈',
    description: '소환사 이름',
    required: true,
  })
  readonly summonerName: SummonerEntity;

  @ApiProperty({
    example: '1',
    description: '소환사 플레이 챔피언 id',
    required: true,
  })
  readonly champId: ChampEntity;
}
