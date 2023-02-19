import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetChampRate {
  readonly winRate: string | number = 0;
  readonly pickRate: string | number = 0;
  readonly spell1: number = 0;
  readonly spell2: number = 0;
  readonly version: string | number = 0;
  constructor(partial: Partial<GetChampRate>) {
    if (partial) Object.assign(this, partial);
  }
}

export class ChampRateDataDto {
  @ApiProperty({
    example: 48.45,
    description: '승률',
    required: true,
  })
  @Transform(({ value }) => {
    return value ? Number(Number(value).toFixed(2)) : 0;
  })
  readonly winRate: number;

  @ApiProperty({
    example: 13.2,
    description: '밴 비율',
    required: true,
  })
  banRate: number;

  @ApiProperty({
    example: 8.19,
    description: '픽률',
    required: true,
  })
  @Transform(({ value }) => {
    return value ? Number(Number(value).toFixed(2)) : 0;
  })
  readonly pickRate: number;

  @ApiProperty({
    example: 'BOTTOM',
    description: '포지션',
    required: true,
  })
  position: string;

  @ApiProperty({
    example: 'spell1 image.png',
    description: '첫번째 스펠이미지',
    required: true,
  })
  readonly spell1Img: string;

  @ApiProperty({
    example: 'spell2 image.png',
    description: '두번째 스펠이미지',
    required: true,
  })
  readonly spell2Img: string;

  @ApiProperty({
    example: '13.3.',
    description: '버전 정보',
    required: true,
  })
  @Transform(({ value }) => {
    return value ? value : 'default version';
  })
  readonly version: string;
}
