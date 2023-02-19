import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { ChampCommonDTO } from '../../../champ/dto/champ/champ.common.dto';
import { CommonEntity } from '../../../common/entities/common.entity';

export class SummonerCommonDTO extends CommonEntity {
  @ApiProperty({
    example: '할배탈',
    description: '소환사 이름',
    required: true,
  })
  readonly summonerName: string;

  @ApiProperty({
    example: 'uuid',
    description: '소환사 id',
    required: true,
  })
  readonly summonerId: string;

  @ApiProperty({
    example: 'uuid',
    description: '소환사 puuid',
    required: true,
  })
  readonly summonerPuuId: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 아이콘',
    required: true,
  })
  readonly summonerIcon: string;

  @ApiProperty({
    example: '120',
    description: '소환사 레벨',
    required: true,
  })
  readonly summonerLevel: string;

  @ApiProperty({
    example: 'SILVER I',
    description: '소환사 티어',
    required: true,
  })
  readonly tier: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 티어 이미지',
    required: true,
  })
  readonly tierImg: string;

  @ApiProperty({
    example: '98',
    description: '소환사 리그 포인트',
    required: true,
  })
  readonly lp: number;

  @ApiProperty({
    example: '75',
    description: '소환사 승리 수',
    required: true,
  })
  readonly win: number;

  @ApiProperty({
    example: '55',
    description: '소환사 패배 수',
    required: true,
  })
  readonly lose: number;

  @ApiProperty({
    example: '57',
    description: '소환사 승률',
    required: true,
  })
  readonly winRate: number;

  @ApiProperty({
    example: '81',
    description: '모스트 챔피언1',
    required: true,
  })
  readonly mostChamp1: ChampEntity;

  @ApiProperty({
    example: '412',
    description: '모스트 챔피언2',
    required: true,
  })
  readonly mostChamp2: ChampEntity;

  @ApiProperty({
    example: '222',
    description: '모스트 챔피언3',
    required: true,
  })
  readonly mostChamp3: ChampEntity;
}
