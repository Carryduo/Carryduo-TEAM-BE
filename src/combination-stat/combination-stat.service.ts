import { CombinationStatRepository } from './combination-stat.repository';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { IndiviudalChampResponseDto, TierListDto, VersionResponseDto } from './dtos/combination-stat.response.dto';
import { CombinationStatCommonDto } from './dtos/combination-stat.common.dto';

@Injectable()
export class CombinationStatService {
  constructor(private readonly combinationStatRepository: CombinationStatRepository) {}

  async getCombinationData(type: string): Promise<TierListDto[]> {
    const versions = await this.combinationStatRepository.getVersions();
    const category: number = CombinationStatCommonDto.editCategoryForEntity(type);
    const versionList: string[] = await sortPatchVersions(versions);
    // 최신 패치버전 조회
    const { category0, category1, category2 } = await this.combinationStatRepository.getMainpageData(versionList[0]);
    let version: string;
    if (category0 >= 30 && category1 >= 30 && category2 >= 30) {
      version = versionList[0];
    } else {
      version = versionList[1];
      // 최신 패치버전의 티어리스트의 길이가 30이 되지 않으면, 이전 패치버전을 response
    }
    const answer = await this.combinationStatRepository.getTierList(category, version);
    const data = answer.map((value, index: number) => {
      return new TierListDto(value, index);
    });
    return data;
  }

  async getIndiviualChampData(champId: string, position: string): Promise<IndiviudalChampResponseDto[] | { result: any[]; message: string }> {
    const versions = await this.combinationStatRepository.getVersions();
    const versionList: string[] = await sortPatchVersions(versions);

    // TODO: 수정
    let option: { category: Brackets; champ: Brackets };
    switch (position) {
      case 'top':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 0,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.mainChampId = :mainChampId', {
              mainChampId: champId,
            });
          }),
        };
        break;
      case 'jungle':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 0,
            }).orWhere('COMBINATION_STAT.category = :category2', {
              category2: 1,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.subChampId = :subChampId', {
              subChampId: champId,
            });
          }),
        };
        break;
      case 'mid':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 1,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.mainChampId = :mainChampId', {
              mainChampId: champId,
            });
          }),
        };
        break;
      case 'ad':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 2,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.mainChampId = :mainChampId', {
              mainChampId: champId,
            });
          }),
        };
        break;
      case 'support':
        option = {
          category: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.category = :category', {
              category: 2,
            });
          }),
          champ: new Brackets((qb) => {
            qb.where('COMBINATION_STAT.subChampId = :subChampId', {
              subChampId: champId,
            });
          }),
        };
        break;
    }

    // 메인페이지 티어리스트 충족 시 최신버전, 아닐 경우 이전버전
    let answer;
    // TODO: 수정
    const { category0, category1, category2 } = await this.combinationStatRepository.getMainpageData(versionList[0]);
    if (category0 >= 30 && category1 >= 30 && category2 >= 30) {
      answer = await this.combinationStatRepository.getIndividualChampData(option, versionList[0]);
    } else {
      answer = await this.combinationStatRepository.getIndividualChampData(option, versionList[1]);
    }

    const result: IndiviudalChampResponseDto[] = [];
    // TODO: 수정
    if (answer.length !== 0) {
      // 승률 계산 및 티어 지정

      answer.map((value, index) => {
        const keys = Object.keys(value);
        type champType = {
          id: string;
          champImg: string;
          champNameEn: string;
          champNameKo: string;
        };
        value.mainChampId = <champType>{};
        value.subChampId = <champType>{};
        // FE 요청에 맞춰 key값 바꾸기
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          let answerKey: string;
          if (key.includes('champ1_')) {
            answerKey = key.split('champ1_')[1];
            value.mainChampId[`${answerKey}`] = value[key];
            delete value[`${key}`];
          } else if (key.includes('champ2_')) {
            answerKey = key.split('champ2_')[1];
            value.subChampId[`${answerKey}`] = value[key];
            delete value[`${key}`];
          }
        }
        value.winrate = Number((value.winrate * 100).toFixed(2));
        value.opScore = Number(Number(value.opScore).toFixed(2));
        if (index <= 2) {
          value.tier = 1;
        } else if (3 <= index && index <= 9) {
          value.tier = 2;
        } else if (10 <= index && index <= 19) {
          value.tier = 3;
        } else if (20 <= index && index <= 26) {
          value.tier = 4;
        } else {
          value.tier = 5;
        }
        return value;
      });

      for (const data of answer) {
        if (position === 'jungle' || position === 'support') {
          const cloneData = data.subChampId;
          data.subChampId = data.mainChampId;
          data.mainChampId = cloneData;
          result.push(data);
        } else {
          result.push(data);
        }
      }
    } else {
      return { result, message: '유효한 데이터(표본 5 이상)가 없습니다' };
    }
    return result;
  }

  async getRecentVersion(): Promise<VersionResponseDto> {
    const versions = await this.combinationStatRepository.getVersions();
    const versionList = await sortPatchVersions(versions);
    const { category0, category1, category2 } = await this.combinationStatRepository.getMainpageData(versionList[0]);
    let version: string;
    if (category0 >= 30 && category1 >= 30 && category2 >= 30) {
      version = versionList[0];
    } else {
      version = versionList[1];
    }
    return { version };
  }
}

async function sortPatchVersions(versions) {
  let data = [];
  for (const value of versions) {
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
