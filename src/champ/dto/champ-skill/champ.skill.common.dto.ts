import { Exclude, Expose } from 'class-transformer';

export class skillSet {
  skillId: string;
  skillName: string;
  skillDesc: string;
  skillToolTip: string;
  skillImg: string;
}

export class ChampSkillCommonDTO {
  @Expose()
  private id: string;
  @Expose()
  private name: string;
  @Expose()
  private desc: string;
  @Expose()
  private toolTip: string;
  @Expose()
  private image: string;

  static transformDto(skillSet: skillSet) {
    const skill = new ChampSkillCommonDTO();
    skill.id = skillSet.skillId;
    skill.name = skillSet.skillName;
    skill.desc = skillSet.skillDesc;
    skill.toolTip = skillSet.skillToolTip;
    skill.image = skillSet.skillImg;
    return skill;
  }
}
