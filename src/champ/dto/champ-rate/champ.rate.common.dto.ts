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
  topRate: number;

  @ApiProperty({
    example: '50.0',
    description: '정글 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  jungleRate: number;

  @ApiProperty({
    example: '50.0',
    description: '미드 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  midRate: number;

  @ApiProperty({
    example: '50.0',
    description: '원딜 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  adRate: number;

  @ApiProperty({
    example: '50.0',
    description: '서포터 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  supportRate: number;

  @ApiProperty({
    example: '12.20',
    description: '게임 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version: string;
}
