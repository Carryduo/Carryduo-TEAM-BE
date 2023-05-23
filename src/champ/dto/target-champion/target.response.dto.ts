import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { ChampRateDataDto } from '../champ-rate/champ.rate.dto';
import { ChampSkillCommonDTO } from '../champ-skill/champ.skill.common.dto';
import { ChampCommonDTO } from '../champ/champ.common.dto';

export class TargetChampionResDto extends IntersectionType(
  ChampCommonDTO,
  ChampRateDataDto,
) {
  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
    type: ChampSkillCommonDTO,
  })
  skill: ChampSkillCommonDTO[];
}
