import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';

export class SummonerCommonDTO extends CommonEntity {
  @ApiProperty({
    example: '할배탈',
    description: '소환사 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerName: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 아이콘',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerIcon: string;

  @ApiProperty({
    example: '120',
    description: '소환사 레벨',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerLevel: string;

  @ApiProperty({
    example: 'SILVER I',
    description: '소환사 티어',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tier: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 티어 이미지',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tierImg: string;

  @ApiProperty({
    example: '98',
    description: '소환사 리그 포인트',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  lp: number;

  @ApiProperty({
    example: '75',
    description: '소환사 승리 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  win: number;

  @ApiProperty({
    example: '55',
    description: '소환사 패배 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  lose: number;

  @ApiProperty({
    example: '57',
    description: '소환사 승률',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  winRate: number;

  @ApiProperty({
    example: '81',
    description: '모스트 챔피언1',
    required: true,
  })
  mostChamp1: string;

  @ApiProperty({
    example: '412',
    description: '모스트 챔피언2',
    required: true,
  })
  mostChamp2: string;

  @ApiProperty({
    example: '222',
    description: '모스트 챔피언3',
    required: true,
  })
  mostChamp3: string;
}
