import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChampSkillCommonDTO {
  @ApiProperty({
    example: 'q',
    description: 'q | w | e | r | passive',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  skillId: string;

  @ApiProperty({
    example: '결정타',
    description: 'q | w | e | r | passive의 스킬 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  skillName: string;

  @ApiProperty({
    example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
    description: 'q | w | e | r | passive의 스킬 설명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  sikllDesc: string;

  @ApiProperty({
    example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
    description: 'q | w | e | r | passive의 스킬 툴팁',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  skillToolTip: string;

  @ApiProperty({
    example: 'example.png',
    description: 'q | w | e | r | passive의 스킬 이미지',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  skillImg: string;
}
