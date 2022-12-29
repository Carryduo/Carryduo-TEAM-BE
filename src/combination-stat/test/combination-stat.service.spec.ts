import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CombinationStatRepository } from '../combination-stat.repository';
import { CombinationStatService } from '../combination-stat.service';
import { CombinationStatEntity } from '../entities/combination-stat.entity';
import * as testData from './data/combination-stat.test.data';
const mockRepository = () => {
  createQueryBuilder: jest.fn();
};

describe('CombinationStatController', () => {
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
      () =>
        new Promise((resolve) => {
          resolve([{ version: '12.23' }, { version: '12.22' }]);
        }),
    );
    jest.spyOn(repository, 'getTierList').mockImplementation(
      (category, version) =>
        new Promise((resolve) => {
          if (category === 0) {
            resolve(testData.input0_tierList);
          } else if (category === 1) {
            resolve(testData.input1_tierList);
          } else if (category === 2) {
            resolve(testData.input2_tierList);
          }
        }),
    );

    expect(await service.getCombinationData('top-jungle')).toEqual(testData.result0_tierList);
    expect(await service.getCombinationData('mid-jungle')).toEqual(testData.result1_tierList);
    expect(await service.getCombinationData('ad-support')).toEqual(testData.result2_tierList);
  });

  it('individualChamp 테스트: 데이터가 없는 경우에 에러 메시지를 잘 응답하는가?', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve([{ version: 'example' }]);
        }),
    );

    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (option, version) =>
        new Promise((resolve) => {
          resolve(testData.result_individualChamp_noResponse);
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
          resolve([{ version: 'example' }]);
        }),
    );

    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (option, version) =>
        new Promise((resolve) => {
          resolve(testData.input_IndividualChamp);
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
    const winrate_support = value_top[0].winrate;
    expect(mainChampId_ad).toEqual('22');
    expect(mainChampId_mid).toEqual('22');
    expect(mainChampId_top).toEqual('22');
    expect(winrate_ad).toEqual(66.67);
    expect(winrate_mid).toEqual(66.67);
    expect(winrate_support).toEqual(66.67);
  });

  it('individualChamp 테스트: 포지션이 서폿인 경우, mainChampId <-> subChampId 변경', async () => {
    jest.spyOn(repository, 'getVersions').mockImplementation(
      () =>
        new Promise((resolve) => {
          resolve([{ version: 'example' }]);
        }),
    );

    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (option, version) =>
        new Promise((resolve) => {
          resolve(testData.input_IndividualChamp);
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
          resolve([{ version: 'example' }]);
        }),
    );

    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (option, version) =>
        new Promise((resolve) => {
          resolve(testData.input_IndividualChamp_jungle);
        }),
    );
    const value_jungle = await service.getIndiviualChampData('875', 'jungle');

    const mainChampId_jungle = value_jungle[0].mainChampId.id;
    expect(mainChampId_jungle).toEqual('875');
  });
});
