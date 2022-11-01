import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CombinationStatRepository } from './combination-stat.repository';
import { CombinationStatService } from './combination-stat.service';
import { CombinationStatEntity } from './entities/combination-stat.entity';

const mockRepository = () => {
  createQueryBuilder: jest.fn();
};
describe('CombinationStatController', () => {
  let service: CombinationStatService;
  let repository: CombinationStatRepository;

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

  const result0 = [
    {
      id: 'daeb531d-6ca4-499e-a15f-45078ffd9faf',
      createdAt: new Date('2022-10-04T04:00:31.540Z'),
      updatedAt: new Date('2022-10-19T13:25:11.695Z'),
      category: 0,
      tier: 1,
      rankInCategory: 1,
      winrate: 84.62,
      sampleNum: 13,
      version: 'old',
      mainChampId: {
        id: '96',
        champNameKo: '코그모',
        champNameEn: 'KogMaw',
        champImg:
          'https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/KogMaw.png',
      },
      subChampId: {
        id: '888',
        champNameKo: '레나타 글라스크',
        champNameEn: 'Renata',
        champImg:
          'https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/Renata.png',
      },
    },
  ];

  const result1 = [
    {
      id: 'daeb531d-6ca4-499e-a15f-45078ffd9faf',
      createdAt: new Date('2022-10-04T04:00:31.540Z'),
      updatedAt: new Date('2022-10-19T13:25:11.695Z'),
      category: 1,
      tier: 1,
      rankInCategory: 1,
      winrate: 84.62,
      sampleNum: 13,
      version: 'old',
      mainChampId: {
        id: '96',
        champNameKo: '코그모',
        champNameEn: 'KogMaw',
        champImg:
          'https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/KogMaw.png',
      },
      subChampId: {
        id: '888',
        champNameKo: '레나타 글라스크',
        champNameEn: 'Renata',
        champImg:
          'https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/Renata.png',
      },
    },
  ];

  const result2 = [
    {
      id: 'daeb531d-6ca4-499e-a15f-45078ffd9faf',
      createdAt: new Date('2022-10-04T04:00:31.540Z'),
      updatedAt: new Date('2022-10-19T13:25:11.695Z'),
      category: 2,
      tier: 1,
      rankInCategory: 1,
      winrate: 84.62,
      sampleNum: 13,
      version: 'old',
      mainChampId: {
        id: '96',
        champNameKo: '코그모',
        champNameEn: 'KogMaw',
        champImg:
          'https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/KogMaw.png',
      },
      subChampId: {
        id: '888',
        champNameKo: '레나타 글라스크',
        champNameEn: 'Renata',
        champImg:
          'https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/Renata.png',
      },
    },
  ];

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('request로 받은 category에 대응해 TierList를 response 하는가?', async () => {
    jest.spyOn(repository, 'getTierList').mockImplementation(
      (category) =>
        new Promise((resolve) => {
          if (category === 0) {
            resolve(result0);
          } else if (category === 1) {
            resolve(result1);
          } else if (category === 2) {
            resolve(result2);
          }
        }),
    );
    expect(await service.getCombinationData('top-jungle')).toBe(result0);
    expect(await service.getCombinationData('mid-jungle')).toBe(result1);
    expect(await service.getCombinationData('ad-support')).toBe(result2);
  });

  // it('request로 받은 position, champId에 대응해 챔피언별 combination 데이터를 response 하는가?', async () => {

  //   jest.spyOn(repository, 'getIndividualChampData').mockImplementation(
  //     (option) =>
  //       new Promise((resolve) => {
  //         if (
  //           option.category ===
  //           new Brackets((qb) => {
  //             qb.where('COMBINATION_STAT.category = :category', {
  //               category: 0,
  //             });
  //           })
  //         ) {
  //           resolve(result0);
  //         } else if (option.category === new Brackets((qb) => {
  //           qb.where('COMBINATION_STAT.category = :category', {
  //             category: 1,
  //           });
  //         }),) {
  //           resolve(result1);
  //         } else if (option.category === new Brackets((qb) => {
  //           qb.where('COMBINATION_STAT.category = :category', {
  //             category: 2,
  //           });
  //         }),) {
  //           resolve(result2);
  //         }
  //       }),
  //   );
  //   expect(await service.getIndiviualChampData('875', 'top')).toBe(result0);
  //   expect(await service.getIndiviualChampData('875', 'support')).toBe(result1);
  //   expect(await service.getIndiviualChampData('875', 'mid')).toBe(result2);
  // });
});
