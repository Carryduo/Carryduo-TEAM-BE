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
    example: '13.1.',
    description: '패치버전',
  })
  version: string;

  @ApiProperty({
    example: '59.11',
    description: '승률',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  winrate: number;

  @ApiProperty({
    example: '59.11',
    description: 'opScore',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  opScore: number;

  @ApiProperty({
    example: '595',
    description: '표본수',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  sampleNum: number;

  @IsNumber()
  @IsNotEmpty()
  champ1_id: string;

  @IsNotEmpty()
  champ1_champNameKo: string;

  @IsNotEmpty()
  champ1_champNameEn: string;

  @IsNotEmpty()
  champ1_champImg: string;

  @IsNumber()
  @IsNotEmpty()
  champ2_id: string;

  @IsNotEmpty()
  champ2_champNameKo: string;

  @IsNotEmpty()
  champ2_champNameEn: string;

  @IsNotEmpty()
  champ2_champImg: string;
}
