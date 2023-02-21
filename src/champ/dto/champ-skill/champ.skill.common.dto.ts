import { ApiProperty } from '@nestjs/swagger';

export class SkillSet {
  readonly skillId: string;
  readonly skillName: string;
  readonly skillDesc: string;
  readonly skillToolTip: string;
  readonly skillImg: string;
}
export class ChampSkillCommonDTO {
  @ApiProperty({
    example: 'q',
    description: 'q | w | e | r | passive',
    required: true,
    name: 'id',
  })
  readonly id: string;
  @ApiProperty({
    example: '결정타',
    description: 'q | w | e | r | passive의 스킬 이름',
    required: true,
    name: 'name',
  })
  readonly name: string;
  @ApiProperty({
    example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
    description: 'q | w | e | r | passive의 스킬 설명',
    required: true,
    name: 'desc',
  })
  readonly desc: string;
  @ApiProperty({
    example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
    description: 'q | w | e | r | passive의 스킬 툴팁',
    required: true,
    name: 'toolTip',
  })
  readonly toolTip: string;
  @ApiProperty({
    example: 'example.png',
    description: 'q | w | e | r | passive의 스킬 이미지',
    required: true,
    name: 'image',
  })
  readonly image: string;
}
