import { Exclude, Expose } from 'class-transformer';

class skillSet {
  skillId: string;
  skillName: string;
  skillDesc: string;
  skillToolTip: string;
  skillImage: string;
}

export class ChampSkillCommonDTO {
  @Exclude() readonly _id: string;
  @Exclude() readonly _name: string;
  @Exclude() readonly _desc: string;
  @Exclude() readonly _toolTip: string;
  @Exclude() readonly _image: string;

  constructor(data: skillSet) {
    this._id = data.skillId;
    this._name = data.skillName;
    this._desc = data.skillDesc;
    this._toolTip = data.skillToolTip;
    this._image = data.skillImage;
  }
  @Expose()
  get id() {
    return this._id;
  }
  @Expose()
  get name() {
    return this._name;
  }
  @Expose()
  get desc() {
    return this._desc;
  }
  @Expose()
  get toolTip() {
    return this._toolTip;
  }
  @Expose()
  get image() {
    return this._image;
  }
}
