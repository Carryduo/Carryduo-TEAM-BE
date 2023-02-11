import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UpdateChampRateCommonDTO } from '../champ-rate/champ.rate.common.dto';
import { ChampSkillDTO } from '../champ-skill/champ.skill.common.dto';
import { ChampDto } from '../champ/champ.common.dto';

export class TargetChampionResDto extends IntersectionType(OmitType(ChampDto, ['champMainImg'] as const), PickType(UpdateChampRateCommonDTO, ['position', 'version'] as const)) {
  @ApiProperty({
    example: '30.77',
    description: '챔피언 승률',
    required: true,
  })
  @Expose()
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
    type: ChampSkillDTO,
  })
  skill: ChampSkillDTO[];
}
