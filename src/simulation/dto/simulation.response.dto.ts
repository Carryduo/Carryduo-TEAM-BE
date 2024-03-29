import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
import { ChampCommonDTO } from '../../champ/dto/champ/champ.common.dto';

export class simulationResponseDto {
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
    example: '59.1',
    description: '조합승률',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  winrate: number;

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
      champId: 875,
      champNameKo: '세트',
      champNameEn: 'Sett',
      champImg: '이미지 url',
    },
    description: '팀A champ1 정보',
    required: false,
  })
  champ1Id: ChampCommonDTO;

  @ApiProperty({
    example: {
      champId: 203,
      champNameKo: '킨드레드',
      champNameEn: 'Kindred',
      champImg: '이미지 url',
    },
    description: '팀A champ2 정보',
    required: false,
  })
  champ2Id: ChampCommonDTO;

  @ApiProperty({
    example: {
      champId: 203,
      champNameKo: '킨드레드',
      champNameEn: 'Kindred',
      champImg: '이미지 url',
    },
    description: '팀B champ1 정보',
    required: false,
  })
  champ3Id: ChampCommonDTO;

  @ApiProperty({
    example: {
      champId: 203,
      champNameKo: '킨드레드',
      champNameEn: 'Kindred',
      champImg: '이미지 url',
    },
    description: '팀B champ2 정보',
    required: false,
  })
  champ4Id: ChampCommonDTO;
}
