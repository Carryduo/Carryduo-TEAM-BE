import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChampRateCommonDTO {
  @ApiProperty({
    example: '50.0',
    description: '승률',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  winRate: number;

  @ApiProperty({
    example: '50.0',
    description: '밴률',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  banRate: number;

  @ApiProperty({
    example: '50.0',
    description: '픽률',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  pickRate: number;

  @ApiProperty({
    example: '50.0',
    description: '탑 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  top: number;

  @ApiProperty({
    example: '50.0',
    description: '정글 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  jungle: number;

  @ApiProperty({
    example: '50.0',
    description: '미드 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  mid: number;

  @ApiProperty({
    example: '50.0',
    description: '원딜 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  ad: number;

  @ApiProperty({
    example: '50.0',
    description: '서포터 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  support: number;

  @ApiProperty({
    example: '12.20',
    description: '게임 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version: string;
}

export class UpdateChampRateCommonDTO {
  @ApiProperty({
    example: '1',
    description: '승 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  win: number;

  @ApiProperty({
    example: '1',
    description: '패 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  lose: number;

  @ApiProperty({
    example: 'TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY',
    description: '포지션',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    example: '2',
    description: '챔피언 플레이 횟수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  pickCount: number;

  @ApiProperty({
    example: '13.1.',
    description: '플레이 게임 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({
    example: '1',
    description: '챔피언 Id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champId: string;
}
