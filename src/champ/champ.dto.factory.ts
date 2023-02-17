import { Injectable } from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampBanRateDto } from './dto/champ-ban/champ.ban.common.dto';
import { GetMostPositionDto } from './dto/champ-position/champ.most.position.dto';
import { ChampRateDataDto, GetChampRateDto } from './dto/champ-rate/champ.rate.dto';
import { ChampSkillCommonDTO, SkillSet } from './dto/champ-skill/champ.skill.common.dto';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { PreferChampUsersResDTO } from './dto/prefer-champ/prefer.champ.users.dto';
import { TargetChampionResDto } from './dto/target-champion/target.response.dto';
import { ChampEntity } from './entities/champ.entity';

@Injectable()
export class champDtoFactory {
  constructor() {}
  async createChampList(champArray: ChampEntity[]) {
    return champArray.map((v) => new ChampCommonDTO(v));
  }
  async createPreferChampUserList(user: UserEntity[]) {
    return user.map((v) => new PreferChampUsersResDTO(v));
  }
  async createChampMostPosition(position: string) {
    //Transform 이용
    return plainToClass(GetMostPositionDto, { position });
  }
  async createChampRate(champRate: GetChampRateDto[]) {
    if (champRate.length === 0) {
      const rate = new GetChampRateDto(null);
      return plainToInstance(ChampRateDataDto, rate);
    } else {
      const rate = new GetChampRateDto(champRate[0]);
      return plainToInstance(ChampRateDataDto, rate);
    }
  }
  async createChampData(champData: ChampCommonDTO) {
    return new ChampCommonDTO(champData);
  }
  async createSkill(skill: SkillSet[]) {
    return skill.map((v) => new ChampSkillCommonDTO(v));
  }
  async createBanRate(banRate: string) {
    return plainToInstance(ChampBanRateDto, { banRate });
  }
  async createtargetChampResponse(
    champRateDto: ChampRateDataDto,
    champDataDto: ChampCommonDTO,
    skill: ChampSkillCommonDTO[],
    position: string,
    banRate: number,
  ) {
    const response = plainToInstance(TargetChampionResDto, {
      ...champDataDto,
      position,
      banRate,
      ...champRateDto,
    });
    response.skill = skill;
    return response;
  }
}
