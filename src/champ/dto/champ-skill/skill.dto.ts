import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChampWinRateDTO } from '../champ/champ.dto';
import { ChampSkillCommonDTO } from './skill.common.dto';

export class ChmapSkillInfoDTO extends PickType(ChampSkillCommonDTO, [
  'skillId',
  'skillName',
  'skillDesc',
  'skillToolTip',
  'skillImg',
]) {}

class skillData {
  @ApiProperty({
    example: 'q',
    description: 'q | w | e | r | passive',
    required: true,
  })
  id: ChmapSkillInfoDTO['skillId'];
  @ApiProperty({
    example: '결정타',
    description: 'q | w | e | r | passive의 스킬 이름',
    required: true,
  })
  name: ChmapSkillInfoDTO['skillName'];
  @ApiProperty({
    example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
    description: 'q | w | e | r | passive의 스킬 설명',
    required: true,
  })
  desc: ChmapSkillInfoDTO['skillDesc'];
  @ApiProperty({
    example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
    description: 'q | w | e | r | passive의 스킬 툴팁',
    required: true,
  })
  toolTip: ChmapSkillInfoDTO['skillToolTip'];
  @ApiProperty({
    example: 'example.png',
    description: 'q | w | e | r | passive의 스킬 이미지',
    required: true,
  })
  image: ChmapSkillInfoDTO['skillImg'];
}

export class ChmapSkillInfoResponseDTO extends PickType(ChampWinRateDTO, [
  'id',
  'champNameEn',
  'champNameKo',
  'champImg',
  'winRate',
  'banRate',
  'pickRate',
]) {
  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
  })
  skill: skillData;
}
