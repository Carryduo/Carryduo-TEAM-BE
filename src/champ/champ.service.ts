import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChampRepository } from './champ.repository';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}

  async getChampList() {
    return await this.champRepository.getChmapList();
  }

  async getTargetChampion(champId: string) {
    return await this.champRepository.getTargetChampion(champId);
  }

  async getPreferChampUsers(champId: string, tier: string) {
    const targetUser = await this.champRepository.findPreferChampUsers(
      champId,
      tier,
    );
    if (targetUser.length === 0)
      throw new HttpException(
        '선호챔피언 유저 정보 조회 실패',
        HttpStatus.NOT_FOUND,
      );
    return targetUser;
  }
}
