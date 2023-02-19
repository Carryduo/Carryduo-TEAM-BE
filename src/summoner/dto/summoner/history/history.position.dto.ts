import { ApiProperty } from '@nestjs/swagger';

export class SummonerPositionDto {
  @ApiProperty({
    example: '10',
    type: Number,
    description: '소환사 포지션 ID',
  })
  readonly id: number;

  @ApiProperty({
    example: '10',
    type: Number,
    description: '소환사 해당 포지션 게임 수 ',
  })
  readonly cnt: number | string;
}
