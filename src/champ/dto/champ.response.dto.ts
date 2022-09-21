import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampEntity } from '../entities/champ.entity';
import { ChampSkillInfoEntity } from '../entities/champSkillInfo.entity';

export class ChampBasicInfoDTO extends PickType(ChampEntity, [
  'id',
  'champNameEn',
  'champNameKo',
  'champImg',
]) {}

export class ChmapSkillInfoDTO extends PickType(ChampSkillInfoEntity, [
  'skillId',
  'skillName',
  'sikllDesc',
  'skillToolTip',
  'skillImg',
]) {}

export class preferChampUsersDTO extends PickType(UserEntity, [
  'id',
  'nickname',
  'profileImg',
  'tier',
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
  desc: ChmapSkillInfoDTO['sikllDesc'];
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

export class TargetChampionResponseDTO extends PickType(ChampEntity, [
  'id',
  'champNameEn',
  'champNameKo',
  'champImg',
]) {
  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
  })
  skill: skillData;
}
