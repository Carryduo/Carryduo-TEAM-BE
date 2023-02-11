import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChampSkillEntity } from 'src/champ/entities/champSkillInfo.entity';

export class ChampSkillDTO {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _name: string;
  @Exclude() private readonly _desc: string;
  @Exclude() private readonly _toolTip: string;
  @Exclude() private readonly _image: string;

  constructor(data: ChampSkillEntity) {
    this._id = data.skillId;
    this._name = data.skillName;
    this._desc = data.skillDesc;
    this._toolTip = data.skillToolTip;
    this._image = data.skillImg;
  }

  @ApiProperty({
    example: 'q',
    description: 'q | w | e | r | passive',
    required: true,
    name: 'id',
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    example: '결정타',
    description: 'q | w | e | r | passive의 스킬 이름',
    required: true,
    name: 'name',
  })
  @Expose()
  get name() {
    return this._name;
  }

  @ApiProperty({
    example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
    description: 'q | w | e | r | passive의 스킬 설명',
    required: true,
    name: 'desc',
  })
  @Expose()
  get desc() {
    return this._desc;
  }

  @ApiProperty({
    example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
    description: 'q | w | e | r | passive의 스킬 툴팁',
    required: true,
    name: 'toolTip',
  })
  @Expose()
  get toolTip() {
    return this._toolTip;
  }

  @ApiProperty({
    example: 'example.png',
    description: 'q | w | e | r | passive의 스킬 이미지',
    required: true,
    name: 'image',
  })
  @Expose()
  get image() {
    return this._image;
  }
}
