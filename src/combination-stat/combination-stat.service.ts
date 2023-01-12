import { CombinationStatRepository } from './combination-stat.repository';
import { Injectable } from '@nestjs/common';
import { Brackets } from 'typeorm';
import { IndiviudalChampResponseDto } from './dtos/combination-stat.response.dto';

@Injectable()
export class CombinationStatService {
  constructor(private readonly combinationStatRepository: CombinationStatRepository) {}

  async getCombinationData(category: string | number) {
    const versions = await this.combinationStatRepository.getVersions();
    switch (category) {
      case 'top-jungle':
        category = 0;
        break;
      case 'mid-jungle':
        category = 1;
        break;
      case 'ad-support':
        category = 2;
        break;
    }
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

    let answer;
    // 최신 패치버전 조회
    answer = await this.combinationStatRepository.getTierList(category, versionList_DESC[0]);

    // 최신 패치버전의 티어리스트의 길이가 30이 되지 않으면, 이전 패치버전을 response
    if (answer.length < 30) {
      answer = await this.combinationStatRepository.getTierList(category, versionList_DESC[1]);
    }

    // 승률 계산 및 티어 지정
    answer.map((value, index) => {
      value.winrate = Number(((value.win / value.sampleNum) * 100).toFixed(2));
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
      value.opScore = value.winrate * 0.7 + value.sampleNum * 0.3;
      delete value.win;
      return value;
    });

    return answer;
  }

  async getIndiviualChampData(champId: string, position: string): Promise<IndiviudalChampResponseDto[] | { result: any[]; message: string }> {
    const versions = await this.combinationStatRepository.getVersions();
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

    let option;
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
    let dataList;
    const { category0, category1, category2 } = await this.combinationStatRepository.getMainpageData(versionList_DESC[0]);
    if (category0 >= 30 && category1 >= 30 && category2 >= 30) {
      dataList = await this.combinationStatRepository.getIndividualChampData(option, versionList_DESC[0]);
    } else {
      dataList = await this.combinationStatRepository.getIndividualChampData(option, versionList_DESC[1]);
    }

    const result = [];
    if (dataList.length !== 0) {
      // 승률 계산 및 티어 지정
      dataList.map((value, index) => {
        value.winrate = Number(((value.win / value.sampleNum) * 100).toFixed(2));
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
        value.opScore = value.winrate * 0.7 + value.sampleNum * 0.3;
        delete value.win;
        return value;
      });

      for (const data of dataList) {
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
}
