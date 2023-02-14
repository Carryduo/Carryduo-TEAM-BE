import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ChampRepository } from './champ.repository';
import { ChampBanRateDto } from './dto/champ-ban/champ.ban.common.dto';
import { GetMostPositionDto, positionList } from './dto/champ-position/champ.most.position.dto';
import { ChampRateDataDto } from './dto/champ-rate/champ.rate.dto';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { PreferChampUsersResDTO } from './dto/prefer-champ/prefer.champ.users.dto';
import { TargetChampionReqDTO } from './dto/target-champion/target.request.dto';

@Injectable()
export class ChampService {
  constructor(private readonly champRepository: ChampRepository) {}

  async getChampList(): Promise<ChampCommonDTO[]> {
    const champList = await this.champRepository.getChampList();
    return plainToInstance(ChampCommonDTO, champList);
  }

  async getPreferChampUsers(champId: string): Promise<PreferChampUsersResDTO[] | []> {
    const users = await this.champRepository.findPreferChampUsers(champId);
    return plainToInstance(PreferChampUsersResDTO, users);
  }

  //TODO: 스펠 이미지 추가
  async getTargetChampion(param: TargetChampionReqDTO) {
    const existChamp = await this.champRepository.existChamp(param.champId);
    if (!existChamp) {
      throw new HttpException('해당하는 챔피언 정보가 없습니다.', HttpStatus.BAD_REQUEST);
    }

    const rateVersionList = await this.champRepository.rateVersion();
    const rateLatestVersions = await this.getVersion(rateVersionList);

    //파라미터값을 DB에 있는 포지션명으로 변경
    const positionDbName = param.position === 'default' ? false : positionList[param.position];
    //default 파라미터인 경우 최대 많이 플레이한 포지션 산출 / DB에 있는 포지션명 할당
    const getPosition = !positionDbName
      ? await this.champRepository.getMostPosition(param.champId, rateLatestVersions[0])
      : positionDbName;

    //default 파라미터인 경우 Dto get 호출 / DB에 있는 포지션명 할당
    const champPosition = !positionDbName ? getPosition[0]?.position : getPosition;
    const { position } = plainToInstance(GetMostPositionDto, { position: champPosition });

    const champData = await this.champRepository.getChampData(
      param.champId,
      champPosition,
      rateLatestVersions[0],
    );

    const transformChampRate = ChampRateDataDto.transform(champData);

    const champDefaultData = await this.champRepository.getChampDefaultData(param.champId);

    const skill = await this.champRepository.getSkillData(param.champId);

    const banInfo = await this.champRepository.getBanRate(param.champId, rateLatestVersions[0]);
    const { banRate } = plainToInstance(ChampBanRateDto, { banRate: banInfo?.banRate });

    const data = {
      id: champDefaultData.id,
      champNameKo: champDefaultData.champNameKo,
      champNameEn: champDefaultData.champNameEn,
      champImg: champDefaultData.champImg,
      skill,
      position,
      banRate,
      winRate: transformChampRate.winRate,
      pickRate: transformChampRate.pickRate,
      spell1Img: transformChampRate.spell1Img,
      spell2Img: transformChampRate.spell2Img,
      version: transformChampRate.version,
    };
    return data;
    // return new TargetChampionResDto(data);
  }

  private async getVersion(versionList: Array<{ version: string }>): Promise<Array<string>> {
    let data = [];
    for (const value of versionList) {
      data.push(value.version);
    }

    data = data.filter((version) => {
      if (version[version.length - 1] === '.') {
        version = version.slice(0, -1);
      }
      if (!isNaN(Number(version))) {
        return version;
      }
    });
    data = data.sort((a, b) => {
      return b.split('.')[0] - a.split('.')[0];
    });
    let versionList_DESC = [];
    let outdatedVersionList = [];
    // recentVersion = 13.10 에서 13을 의미
    const recentVersion = Number(String(data[0]).split('.')[0]);
    for (let i = 0; i < data.length; i++) {
      const version = data[i];
      if (Number(version.split('.')[0]) < recentVersion) {
        outdatedVersionList.push(version);
      } else {
        versionList_DESC.push(version);
      }
    }
    // 최근버전 모음 (ex 13.1, 13.10)
    versionList_DESC = versionList_DESC.sort((a, b) => {
      return Number(String(b).split('.')[1]) - Number(String(a).split('.')[1]);
    });
    // 이전버전 모음  (ex. 12.1, 12.10)
    outdatedVersionList = outdatedVersionList.sort((a, b) => {
      return Number(String(b).split('.')[1]) - Number(String(a).split('.')[1]);
    });
    // 최신버전 모음 뒤에 이전버전 합치기
    versionList_DESC.push(...outdatedVersionList);
    return versionList_DESC;
  }
}
