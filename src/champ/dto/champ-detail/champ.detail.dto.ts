import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ChampRateCommonDTO } from '../champ-rate/champ.rate.common.dto';
import { ChampCommonDTO } from '../champ/champ.common.dto';
import { ChampDetailCommonDTO } from './champ.detail.common.dto';

class spellData {
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
}

export class ChampDetailResponseDTO extends IntersectionType(
  ChampCommonDTO,
  ChampRateCommonDTO,
) {
  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
  })
  skill: ChampDetailCommonDTO;

  @ApiProperty({
    description: '챔피언 스펠 정보',
    isArray: true,
  })
  spellInfo: spellData;
}
