import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}

  async getChampList() {
    return await this.champRepository.getChmapList();
  }

  async getTargetChampion(champId: string) {
    let skill = [];
    const champInfo = await this.champRepository.getTargetChampion(champId);
    if (!champInfo) {
      throw new HttpException(
        '해당하는 챔피언 정보가 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    champInfo.champSkillInfo.map((value) => {
      skill.push({
        id: value.skillId,
        name: value.skillName,
        desc: value.sikllDesc,
        toolTip: value.skillToolTip,
        image: value.skillImg,
      });
    });

    const data = {
      id: champInfo.id,
      champNameKo: champInfo.champNameKo,
      champNameEn: champInfo.champNameEn,
      champImg: champInfo.champImg,
      skill,
    };
    return data;
  }

  async getPreferChampUsers(champId: string) {
    const targetUser = await this.champRepository.findPreferChampUsers(champId);
    if (targetUser.length === 0)
      throw new HttpException(
        '선호챔피언 유저 정보 조회 실패',
        HttpStatus.NOT_FOUND,
      );
    return targetUser;
  }
}
