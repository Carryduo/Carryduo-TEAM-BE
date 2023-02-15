import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ChampSkillCommonDTO } from '../champ-skill/champ.skill.common.dto';

export class TargetChampionData {
  id: string;
  champNameKo: string;
  champNameEn: string;
  champImg: string;
  winRate: string | number;
  banRate: string | number;
  pickRate: string | number;
  position: string;
  spell1Img: string;
  spell2Img: string;
  version: string;
  skill: ChampSkillCommonDTO;
}

export class TargetChampionResDto {
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: '가렌',
    description: '챔피언 한글 이름',
    required: true,
  })
  readonly champNameKo: string;

  @ApiProperty({
    example: 'Garen',
    description: '챔피언 영문 이름',
    required: true,
  })
  readonly champNameEn: string;

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 이미지 url',
    required: true,
  })
  readonly champImg: string;

  @ApiProperty({
    example: 48.45,
    description: '승률',
    required: true,
  })
  readonly winRate: string | number;

  @ApiProperty({
    example: 13.2,
    description: '밴 비율',
    required: true,
  })
  readonly banRate: string | number;

  @ApiProperty({
    example: 8.19,
    description: '픽률',
    required: true,
  })
  readonly pickRate: string | number;

  @ApiProperty({
    example: 'spell1 image.png',
    description: '첫번째 스펠이미지',
    required: true,
  })
  readonly spell1Img: number | string;

  @ApiProperty({
    example: 'spell2 image.png',
    description: '두번째 스펠이미지',
    required: true,
  })
  readonly spell2Img: number | string;

  @ApiProperty({
    example: '13.3.',
    description: '버전 정보',
    required: true,
  })
  readonly version: string;

  @ApiProperty({
    example: 'BOTTOM',
    description: '포지션',
    required: true,
  })
  readonly position: string;

  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
    type: ChampSkillCommonDTO,
  })
  readonly skill: ChampSkillCommonDTO;
}
