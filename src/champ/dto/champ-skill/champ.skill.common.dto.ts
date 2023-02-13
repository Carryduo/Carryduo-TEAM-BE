import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, plainToInstance, Transform, Type } from 'class-transformer';
import { ChampSkillEntity } from 'src/champ/entities/champSkillInfo.entity';

// export class ChampSkillCommonDTO {
//   @Exclude() private _id: string;
//   @Exclude() private _name: string;
//   @Exclude() private _desc: string;
//   @Exclude() private _toolTip: string;
//   @Exclude() private _image: string;

//   constructor(data: ChampSkillEntity) {
//     this._id = data.skillId;
//     this._name = data.skillName;
//     this._desc = data.skillDesc;
//     this._toolTip = data.skillToolTip;
//     this._image = data.skillImg;
//   }

//   @ApiProperty({
//     example: 'q',
//     description: 'q | w | e | r | passive',
//     required: true,
//     name: 'id',
//   })
//   @Expose()
//   get id() {
//     return this._id;
//   }

//   @ApiProperty({
//     example: '결정타',
//     description: 'q | w | e | r | passive의 스킬 이름',
//     required: true,
//     name: 'name',
//   })
//   @Expose()
//   get name() {
//     return this._name;
//   }

//   @ApiProperty({
//     example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
//     description: 'q | w | e | r | passive의 스킬 설명',
//     required: true,
//     name: 'desc',
//   })
//   @Expose()
//   get desc() {
//     return this._desc;
//   }

//   @ApiProperty({
//     example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
//     description: 'q | w | e | r | passive의 스킬 툴팁',
//     required: true,
//     name: 'toolTip',
//   })
//   @Expose()
//   get toolTip() {
//     return this._toolTip;
//   }

//   @ApiProperty({
//     example: 'example.png',
//     description: 'q | w | e | r | passive의 스킬 이미지',
//     required: true,
//     name: 'image',
//   })
//   @Expose()
//   get image() {
//     return this._image;
//   }
// }

export class ChampSkillCommonDTO {
  @Exclude() private _id: string;

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
  private _name: string;
  get name() {
    return this._name;
  }

  @ApiProperty({
    example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
    description: 'q | w | e | r | passive의 스킬 설명',
    required: true,
    name: 'desc',
  })
  @Expose({ name: 'skillDesc' })
  private _desc: string;
  get desc() {
    return this._desc;
  }

  @ApiProperty({
    example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
    description: 'q | w | e | r | passive의 스킬 툴팁',
    required: true,
    name: 'toolTip',
  })
  @Expose({ name: 'skillToolTip' })
  private _toolTip: string;
  get toolTip() {
    return this._toolTip;
  }

  @ApiProperty({
    example: 'example.png',
    description: 'q | w | e | r | passive의 스킬 이미지',
    required: true,
    name: 'image',
  })
  @Expose({ name: 'skillImg' })
  private _image: string;
  get image() {
    return this._image;
  }
  static transformArray(data: ChampSkillEntity[]) {
    const skillData = data.map((v) => plainToInstance(ChampSkillCommonDTO, v));
    return skillData;
  }
}
