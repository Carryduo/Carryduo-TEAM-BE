import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { ChampRateCommonDTO, UpdateChampRateCommonDTO } from '../champ-rate/champ.rate.common.dto';
import { ChampPosition } from '../champ-rate/champ.rate.dto';
import { ChampCommonDTO } from '../champ/champ.common.dto';
import { ChampDetailCommonDTO, ChampSkillDTO } from './champ.detail.common.dto';

export class spellData {
  @ApiProperty({
    example: '20',
    description: '스펠 총 게임수',
    required: true,
  })
  total: number;

  @ApiProperty({
    example: '80.00',
    description: '스펠 픽률',
    required: true,
  })
  pickRate: number;

  @ApiProperty({
    example: 'example.png',
    description: '스펠 1 이미지',
    required: true,
  })
  spell1Img: string;

  @ApiProperty({
    example: 'example.png',
    description: '스펠 2 이미지',
    required: true,
  })
  spell2Img: string;

  @ApiProperty({
    example: '12.20',
    description: '스펠 버전',
    required: true,
  })
  spellVersion: string;
}

export class ChampDetailResponseDTO extends IntersectionType(OmitType(ChampCommonDTO, ['champMainImg']), OmitType(ChampRateCommonDTO, ['top', 'jungle', 'mid', 'ad', 'support', 'version'])) {
  @ApiProperty({
    description: '챔피언 포지션 정보',
    type: ChampPosition,
  })
  rateInfo: {
    rateVersion: string;
    rate: ChampPosition;
  };

  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
    type: ChampDetailCommonDTO,
  })
  skill: ChampDetailCommonDTO[];

  @ApiProperty({
    description: '챔피언 스펠 정보',
    isArray: true,
    type: spellData,
  })
  spellInfo: spellData[];
}

export class UpdateChampDetailResponseDTO extends IntersectionType(OmitType(ChampCommonDTO, ['champMainImg']), PickType(UpdateChampRateCommonDTO, ['position', 'version'])) {
  @ApiProperty({
    example: '30.77',
    description: '챔피언 승률',
    required: true,
  })
  winRate: number;

  @ApiProperty({
    example: '0.25',
    description: '챔피언 밴률',
    required: true,
  })
  banRate: number;

  @ApiProperty({
    example: '3.27',
    description: '챔피언 픽률',
    required: true,
  })
  pickRate: number;

  @ApiProperty({
    example: 'example.png',
    description: '스펠 1 이미지',
    required: true,
  })
  spell1Img: string;

  @ApiProperty({
    example: 'example.png',
    description: '스펠 2 이미지',
    required: true,
  })
  spell2Img: string;

  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
    type: ChampDetailCommonDTO,
  })
  skill: ChampSkillDTO[];
}
