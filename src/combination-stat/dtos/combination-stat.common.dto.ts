import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';

export class CombinationStatCommonDto {
  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '유저 고유 ID',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: '2022-09-17',
    description: '생성 날짜',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-09-17',
    description: '생성 날짜',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '0(top-jungle)/1(mid-jungle)/2(ad-support)',
    description: '조합승률을 보여줄',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  category: number;

  @ApiProperty({
    example: '1',
    description: '조합승률 데이터의 티어',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  tier?: number;

  @ApiProperty({
    example: '1',
    description: '승',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  win?: number;

  @ApiProperty({
    example: '59.11',
    description: '승률',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  winrate?: number;

  @ApiProperty({
    example: '59.11',
    description: 'opScore',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  opScore?: number;

  @ApiProperty({
    example: '595',
    description: '표본수',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  sampleNum: number;

  @ApiProperty({
    example: {
      id: '875',
      champNameKo: '세트',
      champNameEn: 'Sett',
      champImg: '이미지 url',
    },
    description: '기준 챔피언 정보',
    required: false,
  })
  mainChampId:
    | string
    | {
        id: string;
        champNameKo: string;
        champNameEn: string;
        champImg: string;
      };

  @ApiProperty({
    example: {
      id: '203',
      champNameKo: '킨드레드',
      champNameEn: 'Kindred',
      champImg: '이미지 url',
    },
    description: '조합 챔피언 정보',
    required: false,
  })
  subChampId:
    | string
    | {
        id: string;
        champNameKo: string;
        champNameEn: string;
        champImg: string;
      };
}
