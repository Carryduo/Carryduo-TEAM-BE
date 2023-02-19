import { CombinationStatRepository } from './combination-stat.repository';
import { Injectable } from '@nestjs/common';
import { IndividualChampRequestDto, TierListRequestDto } from './dtos/combination-stat.request.dto';
import { IndividualChampResponseDto, TierListResponseDto, VersionResponseDto } from './dtos/combination-stat.response.dto';

@Injectable()
export class CombinationStatService {
  constructor(private readonly combinationStatRepository: CombinationStatRepository) {}

  async getTierList(requestOption: TierListRequestDto): Promise<TierListResponseDto[]> {
    const versions = await this.combinationStatRepository.getVersions();
    const versionList: string[] = await sortPatchVersions(versions);
    // 최신 패치버전 조회
    const { category0, category1, category2 } = await this.combinationStatRepository.getMainpageData(versionList[0]);
    let version: string;
    if (category0 >= 30 && category1 >= 30 && category2 >= 30) {
      version = versionList[0];
    } else {
      version = versionList[1];
    }
    // requestOption -> toEntity 책임은 누구에게?
    const answer = await this.combinationStatRepository.getTierList(requestOption.toEntity(version));
    const data = answer.map((value, index: number) => {
      return new TierListResponseDto(value, index);
    });
    return data;
  }

  async getIndiviualChampData(requestOption: IndividualChampRequestDto): Promise<IndividualChampResponseDto[] | { result: any[]; message: string }> {
    const versions = await this.combinationStatRepository.getVersions();
    const versionList: string[] = await sortPatchVersions(versions);

    const { category0, category1, category2 } = await this.combinationStatRepository.getMainpageData(versionList[0]);
    let version: string;
    if (category0 >= 30 && category1 >= 30 && category2 >= 30) {
      version = versionList[0];
    } else {
      version = versionList[1];
    }
    const whereOption = this.combinationStatRepository.createIndividualRequestOption(requestOption);
    const answer = await this.combinationStatRepository.getIndividualChampData(whereOption, requestOption.toEntity(version));

    let result: IndividualChampResponseDto[] = [];
    if (answer.length !== 0) {
      result = answer.map((value) => {
        return new IndividualChampResponseDto(value, requestOption.position);
      });
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
    return new VersionResponseDto(version);
  }
}

async function sortPatchVersions(versions: { version: string }[]): Promise<string[]> {
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
