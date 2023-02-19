import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RecentChampDto {
  @ApiProperty({
    example: '86',
    description: '최근 플레이 챔피언 정보',
  })
  readonly recentChampId: string;

  @ApiProperty({
    example: '가렌',
    description: '최근 플레이 챔피언 이름',
  })
  readonly recentChampName: string;

  @ApiProperty({
    example: 'example.png',
    description: '최근 플레이 챔피언 이미지',
  })
  readonly recentChampImg: string;

  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: '5',
    description: '최근 플레이 챔피언 승 수',
  })
  readonly recentChampWin: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: '5',
    description: '최근 플레이 챔피언 패 수',
  })
  readonly recentChampLose: number;

  @Transform(({ value }) => Number(Number(value).toFixed(2)))
  @ApiProperty({
    example: '50',
    description: '최근 플레이 챔피언 승률',
  })
  readonly recentChampRate: number;

  @Transform(({ value }) => Number(value))
  @ApiProperty({
    example: '10',
    description: '챔피언으로 플레이한 게임 수',
  })
  readonly recentChampTotal: number;
}
