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
    repository = module.get<CombinationStatRepository>(
      CombinationStatRepository,
    );
  });

  it('request로 받은 category에 대응해 TierList를 response 하는가?', async () => {
    repository.getIndividualChampData = jest.fn();
    jest.spyOn(repository, 'getTierList').mockImplementation(
      (category) =>
        new Promise((resolve) => {
          if (category === 0) {
            resolve(testData.result0_tierList);
          } else if (category === 1) {
            resolve(testData.result1_tierList);
          } else if (category === 2) {
            resolve(testData.result2_tierList);
          }
        }),
    );
    expect(await service.getCombinationData('top-jungle')).toEqual(
      testData.result0_tierList,
    );
    expect(await service.getCombinationData('mid-jungle')).toEqual(
      testData.result1_tierList,
    );
    expect(await service.getCombinationData('ad-support')).toEqual(
      testData.result2_tierList,
    );
  });

  it('individualChamp 테스트: 데이터가 없는 경우에 에러 메시지를 잘 응답하는가?', async () => {
    jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
      (option) =>
        new Promise((resolve) => {
          resolve(testData.result_individualChamp_noResponse);
        }),
    );
    expect(await service.getIndiviualChampData('888', 'support')).toEqual({
      result: testData.result_individualChamp_noResponse,
      message: '유효한 데이터(표본 5 이상)가 없습니다',
    });
  });
});
