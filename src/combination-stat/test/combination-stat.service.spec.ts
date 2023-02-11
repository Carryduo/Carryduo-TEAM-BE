import { CombinationStatRepositoryRawQueryDto, CombinationStatRepositoryVersionResponseDto } from './../dtos/combination-stat.repository.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CombinationStatRepository } from '../combination-stat.repository';
import { CombinationStatService } from '../combination-stat.service';
import { CombinationStatEntity } from '../entities/combination-stat.entity';
import * as testData from './data/combination-stat.test.data';
import { Brackets } from 'typeorm';
const mockRepository = () => {
  createQueryBuilder: jest.fn();
};

describe('CombinationStatService', () => {
  let service: CombinationStatService;
  let repository: CombinationStatRepository;
  jest.setTimeout(50000);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CombinationStatService,
        CombinationStatRepository,
        {
          provide: getRepositoryToken(CombinationStatEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<CombinationStatService>(CombinationStatService);
    repository = module.get<CombinationStatRepository>(CombinationStatRepository);
  });

  it('request로 받은 category에 대응해 TierList를 response 하는가?', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      (): Promise<CombinationStatRepositoryVersionResponseDto[]> =>
        new Promise((resolve) => {
          const data = [{ version: '13.1.' }, { version: '12.23' }];
          resolve(
            data.map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );
    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_recentVersion);
        }),
    );

    jest.spyOn(repository, 'getTierList').mockImplementation(
      (requestOption: { category: number; version: string }): Promise<CombinationStatRepositoryRawQueryDto[]> =>
        new Promise((resolve) => {
          const { category, version } = requestOption;
          if (category === 0) {
            if (version === testData.input0_tierList[0].version) {
              resolve(
                testData.input0_tierList.map((value) => {
                  return new CombinationStatRepositoryRawQueryDto(value);
                }),
              );
            } else {
              resolve(
                testData.input0_tierList_oldVersion.map((value) => {
                  return new CombinationStatRepositoryRawQueryDto(value);
                }),
              );
            }
          }
          if (category === 1) {
            if (version === testData.input1_tierList[0].version) {
              resolve(
                testData.input1_tierList.map((value) => {
                  return new CombinationStatRepositoryRawQueryDto(value);
                }),
              );
            } else {
              resolve(
                testData.input1_tierList_oldVersion.map((value) => {
                  return new CombinationStatRepositoryRawQueryDto(value);
                }),
              );
            }
          }
          if (category === 2) {
            if (version === testData.input2_tierList[0].version) {
              resolve(
                testData.input2_tierList.map((value) => {
                  return new CombinationStatRepositoryRawQueryDto(value);
                }),
              );
            } else {
              resolve(
                testData.input2_tierList_oldVersion.map((value) => {
                  return new CombinationStatRepositoryRawQueryDto(value);
                }),
              );
            }
          }
        }),
    );

    const response = await service.getTierList('top-jungle');

    expect(response[0].category).toEqual(0);
    expect(response[0].version).toEqual('13.1.');
    const response_mid = await service.getTierList('mid-jungle');

    expect(response_mid[0].version).toEqual('13.1.');
    expect(response_mid[0].category).toEqual(1);
    const response_ad = await service.getTierList('ad-support');
    expect(response_ad[0].version).toEqual('13.1.');
    expect(response_ad[0].category).toEqual(2);
  });

  it('individualChamp 테스트: 데이터가 없는 경우에 에러 메시지를 잘 응답하는가?', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: 'example' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );

    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_recentVersion);
        }),
    );
    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (requestOption: { option: { category: Brackets; champ: Brackets }; version: string }): Promise<CombinationStatRepositoryRawQueryDto[]> =>
        new Promise((resolve) => {
          resolve(
            testData.result_individualChamp_noResponse.map((value) => {
              return new CombinationStatRepositoryRawQueryDto(value);
            }),
          );
        }),
    );
    expect(await service.getIndiviualChampData('888', 'support')).toEqual({
      result: testData.result_individualChamp_noResponse,
      message: '유효한 데이터(표본 5 이상)가 없습니다',
    });
  });

  it('individualChamp 테스트: 포지션이 정글/서폿이 아닌 경우, mainChampId <-> subChampId 변경X', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: 'example' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );

    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_recentVersion);
        }),
    );
    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (requestOption: { option: { category: Brackets; champ: Brackets }; version: string }): Promise<CombinationStatRepositoryRawQueryDto[]> =>
        new Promise((resolve) => {
          resolve(
            JSON.parse(JSON.stringify(testData.input_IndividualChamp)).map((value) => {
              return new CombinationStatRepositoryRawQueryDto(value);
            }),
          );
        }),
    );
    const value_ad = await service.getIndiviualChampData('875', 'ad');
    const value_mid = await service.getIndiviualChampData('875', 'top');
    const value_top = await service.getIndiviualChampData('875', 'mid');

    const mainChampId_ad = value_ad[0].mainChampId.id;
    const mainChampId_mid = value_mid[0].mainChampId.id;
    const mainChampId_top = value_top[0].mainChampId.id;
    const winrate_ad = value_ad[0].winrate;
    const winrate_mid = value_mid[0].winrate;
    const winrate_top = value_top[0].winrate;
    expect(mainChampId_ad).toEqual('22');
    expect(mainChampId_mid).toEqual('22');
    expect(mainChampId_top).toEqual('22');
    expect(winrate_ad).toEqual(66.67);
    expect(winrate_mid).toEqual(66.67);
    expect(winrate_top).toEqual(66.67);
  });

  it('individualChamp 테스트: 포지션이 서폿인 경우, mainChampId <-> subChampId 변경', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: 'example' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );

    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_recentVersion);
        }),
    );
    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (requestOption: { option: { category: Brackets; champ: Brackets }; version: string }) =>
        new Promise((resolve) => {
          resolve(
            testData.input_IndividualChamp.map((value) => {
              return new CombinationStatRepositoryRawQueryDto(value);
            }),
          );
        }),
    );
    const value_support = await service.getIndiviualChampData('875', 'support');

    const mainChampId_support = value_support[0].mainChampId.id;
    expect(mainChampId_support).toEqual('875');
  });

  it('individualChamp 테스트: 포지션이 정글인 경우, mainChampId <-> subChampId 변경', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: 'example' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );

    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_recentVersion);
        }),
    );
    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (requestOption: { option: { category: Brackets; champ: Brackets }; version: string }) =>
        new Promise((resolve) => {
          resolve(
            testData.input_IndividualChamp_jungle.map((value) => {
              return new CombinationStatRepositoryRawQueryDto(value);
            }),
          );
        }),
    );
    const value_jungle = await service.getIndiviualChampData('875', 'jungle');

    const mainChampId_jungle = value_jungle[0].mainChampId.id;
    expect(mainChampId_jungle).toEqual('875');
  });

  it('individualChamp 테스트: 메인페이지 티어리스트가 충족되지 않으면, 이전 패치버전 데이터를 응답하는가?', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: '13.1.' }, { version: '12.23' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );

    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_oldVersion);
        }),
    );

    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (requestOption: { option: { category: Brackets; champ: Brackets }; version: string }) =>
        new Promise((resolve) => {
          const { version } = requestOption;
          if (testData.input_IndividualChamp_jungle_recentVersion[0].version === version) {
            resolve(
              testData.input_IndividualChamp_jungle_recentVersion.map((value) => {
                return new CombinationStatRepositoryRawQueryDto(value);
              }),
            );
          } else {
            resolve(
              testData.input_IndividualChamp_jungle_oldVersion.map((value) => {
                return new CombinationStatRepositoryRawQueryDto(value);
              }),
            );
          }
        }),
    );
    const data = await service.getIndiviualChampData('875', 'jungle');
    expect(data[0].version).toEqual('12.23');
  });

  it('individualChamp 테스트: 메인페이지 티어리스트가 충족되면, 최신 패치버전 데이터를 응답하는가?', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: '13.1.' }, { version: '12.23' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );

    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_recentVersion);
        }),
    );

    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (requestOption: { option: { category: Brackets; champ: Brackets }; version: string }) =>
        new Promise((resolve) => {
          const { version } = requestOption;
          if (testData.input_IndividualChamp_jungle_recentVersion[0].version === version) {
            resolve(
              testData.input_IndividualChamp_jungle_recentVersion.map((value) => {
                return new CombinationStatRepositoryRawQueryDto(value);
              }),
            );
          } else {
            resolve(
              testData.input_IndividualChamp_jungle_oldVersion.map((value) => {
                return new CombinationStatRepositoryRawQueryDto(value);
              }),
            );
          }
        }),
    );
    const data = await service.getIndiviualChampData('875', 'jungle');
    expect(data[0].version).toEqual('13.1.');
  });

  it('version 테스트: 메인페이지 티어리스트가 충족되면, 최신 패치버전을 응답하는가?', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: '13.1.' }, { version: '12.23' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );

    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_recentVersion);
        }),
    );
    const response = await service.getRecentVersion();
    expect(response.version).toEqual('13.1.');
  });
  it('version 테스트: 메인페이지 티어리스트가 충족되지 않으면, 이전 패치버전을 응답하는가?', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve(
            [{ version: '13.1.' }, { version: '12.23' }].map((value) => {
              return new CombinationStatRepositoryVersionResponseDto(value);
            }),
          );
        }),
    );
    jest.spyOn(repository, 'getMainpageData').mockImplementation(
      (version) =>
        new Promise((resolve) => {
          resolve(testData.result_mainPageData_oldVersion);
        }),
    );
    const response = await service.getRecentVersion();
    expect(response.version).toEqual('12.23');
  });
});
