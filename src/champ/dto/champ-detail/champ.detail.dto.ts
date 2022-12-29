import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { ChampRateCommonDTO } from '../champ-rate/champ.rate.common.dto';
import { ChampPosition } from '../champ-rate/champ.rate.dto';
import { ChampCommonDTO } from '../champ/champ.common.dto';
import { ChampDetailCommonDTO } from './champ.detail.common.dto';

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
