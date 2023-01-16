import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CombinationStatCommonDto } from './combination-stat.common.dto';

export class TierListResponseDto extends OmitType(CombinationStatCommonDto, ['champ1_champImg', 'champ1_champNameEn', 'champ1_champNameKo', 'champ1_id', 'champ2_champImg', 'champ2_champNameEn', 'champ2_champNameKo', 'champ2_id']) {
  @ApiProperty({
    example: '1',
    description: '조합승률 데이터의 티어',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  tier: number;

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
  mainChampId: {
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
  subChampId: {
    id: string;
    champNameKo: string;
    champNameEn: string;
    champImg: string;
  };
}

export class IndiviudalChampResponseDto extends OmitType(TierListResponseDto, ['tier']) {}

export class VersionResponseDto extends PickType(CombinationStatCommonDto, ['version']) {}
