import { Exclude, Expose } from 'class-transformer';

export class skillSet {
  readonly skillId: string;
  readonly skillName: string;
  readonly skillDesc: string;
  readonly skillToolTip: string;
  readonly skillImg: string;
}

export class ChampSkillCommonDTO {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
  readonly toolTip: string;
  readonly image: string;

  constructor(data: skillSet) {
    this.id = data.skillId;
    this.name = data.skillName;
    this.desc = data.skillDesc;
    this.toolTip = data.skillToolTip;
    this.image = data.skillImg;
  }
}
