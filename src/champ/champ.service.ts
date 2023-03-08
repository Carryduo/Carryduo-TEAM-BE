import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TransferChampData } from './champ.data.transfer';
import { ChampRepository } from './champ.repository';
import { GetChampRate } from './dto/champ-rate/champ.rate.dto';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { PreferChampUsersDTO } from './dto/prefer-champ/prefer.champ.users.dto';
import { TargetChampionReqDTO } from './dto/target-champion/target.request.dto';
import { TargetChampionResDto } from './dto/target-champion/target.response.dto';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository, private readonly transfer: TransferChampData) {}

  async getChampList(): Promise<ChampCommonDTO[]> {
    const champList = await this.champRepository.getChampList();
    return champList.map((v) => plainToInstance(ChampCommonDTO, v));
  }

  async getPreferChampUsers(champId: string): Promise<PreferChampUsersDTO[] | []> {
    const users = await this.champRepository.findPreferChampUsers(champId);
    return users.map((v) => plainToInstance(PreferChampUsersDTO, v));
  }

  async getTargetChampion(param: TargetChampionReqDTO) {
    const existChamp = await this.champRepository.existChamp(param.champId);
    if (!existChamp) {
      throw new HttpException('해당하는 챔피언 정보가 없습니다.', HttpStatus.BAD_REQUEST);
    }

    const rateVersionList = await this.champRepository.rateVersion();
    const rateLatestVersion = this.transfer.gameVersion(rateVersionList);

    const champData = await this.champRepository.getChampDefaultData(param.champId);

    const skillInfo = await this.champRepository.getSkillData(param.champId);
    const skill = await this.transfer.champSkill(skillInfo);

    const champPosition = await this.transfer.champPosition(param, rateLatestVersion);
    const banInfo = await this.champRepository.getBanRate(param.champId, rateLatestVersion);
    const champRateInfo: GetChampRate[] | [] = await this.champRepository.getChampRate(param.champId, champPosition, rateLatestVersion);
    const champRate = await this.transfer.champRate(champRateInfo, banInfo?.banRate, champPosition);

    return plainToInstance(TargetChampionResDto, {
      ...champData,
      ...champRate,
      skill,
    });
  }
}
