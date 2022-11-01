import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChampWinRateDTO } from '../champ/champ.dto';
import { ChampDetailCommonDTO } from './champ.detail.common.dto';

export class ChmapSkillInfoDTO extends PickType(ChampDetailCommonDTO, [
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

export class ChampDetailResponseDTO extends PickType(ChampWinRateDTO, [
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

  @ApiProperty({
    description: '챔피언 스펠 정보',
    isArray: true,
  })
  spellInfo: spellData;
}

export class ChampDetailDBResponseDTO extends PickType(ChampWinRateDTO, [
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

  @ApiProperty({
    description: '챔피언 스펠 정보',
    isArray: true,
  })
  spellInfo: spellData;
}
