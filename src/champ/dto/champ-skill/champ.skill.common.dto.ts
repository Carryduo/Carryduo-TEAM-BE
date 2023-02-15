import { ApiProperty } from '@nestjs/swagger';

export class SkillSet {
  readonly skillId: string;
  readonly skillName: string;
  readonly skillDesc: string;
  readonly skillToolTip: string;
  readonly skillImg: string;
}

//db컬럼명과 응답 response가 달라 static 메서드 사용
export class ChampSkillCommonDTO {
  @ApiProperty({
    example: 'q',
    description: 'q | w | e | r | passive',
    required: true,
    name: 'id',
  })
  private id: string;
  @ApiProperty({
    example: '결정타',
    description: 'q | w | e | r | passive의 스킬 이름',
    required: true,
    name: 'name',
  })
  private name: string;
  @ApiProperty({
    example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
    description: 'q | w | e | r | passive의 스킬 설명',
    required: true,
    name: 'desc',
  })
  private desc: string;
  @ApiProperty({
    example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
    description: 'q | w | e | r | passive의 스킬 툴팁',
    required: true,
    name: 'toolTip',
  })
  private toolTip: string;
  @ApiProperty({
    example: 'example.png',
    description: 'q | w | e | r | passive의 스킬 이미지',
    required: true,
    name: 'image',
  })
  private image: string;

  static transformDto(skillSet: SkillSet) {
    const skill = new ChampSkillCommonDTO();
    skill.id = skillSet.skillId;
    skill.name = skillSet.skillName;
    skill.desc = skillSet.skillDesc;
    skill.toolTip = skillSet.skillToolTip;
    skill.image = skillSet.skillImg;
    return skill;
  }
}
