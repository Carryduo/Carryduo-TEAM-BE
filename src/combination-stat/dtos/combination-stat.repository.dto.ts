import { CombinationStatEntity } from './../entities/combination-stat.entity';
import { Exclude, Expose } from 'class-transformer';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { Brackets } from 'typeorm';
export class CombinationStatRepositoryDto {
  @Exclude() protected _id: string;
  @Exclude() protected _createdAt: Date;
  @Exclude() protected _updatedAt: Date;
  @Exclude() protected _category: number;
  @Exclude() protected _win: number;
  @Exclude() protected _lose: number;
  @Exclude() protected _sampleNum: number;
  @Exclude() protected _version: string;
  @Exclude() protected _mainChampId: ChampEntity;
  @Exclude() protected _subChampId: ChampEntity;

  @Expose()
  get id() {
    return this._id;
  }

  @Expose()
  get createdAt() {
    return this._createdAt;
  }

  @Expose()
  get updatedAt() {
    return this._updatedAt;
  }

  @Expose()
  get category() {
    return this._category;
  }

  @Expose()
  get win() {
    return this._win;
  }

  @Expose()
  get lose() {
    return this._lose;
  }

  @Expose()
  get sampleNum() {
    return this._sampleNum;
  }

  @Expose()
  get version() {
    return this._version;
  }

  @Expose()
  get mainChampId() {
    return this._mainChampId;
  }

  @Expose()
  get subChampId() {
    return this._subChampId;
  }

  static createTierListRequestOption(type: string, version: string) {
    let category: number;
    switch (type) {
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
    return { category, version };
  }

  static createIndividualRequestOption(position: string, champId: string, version: string): { option: { category: Brackets; champ: Brackets }; version: string } {
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
    return { option, version };
  }
}

export class CombinationStatRepositoryVersionResponseDto extends CombinationStatRepositoryDto {
  constructor(data: { version: string }) {
    super();
    this._version = data.version;
  }

  get version() {
    return this._version;
  }

  static editVersionForEntity(data: { version: string }) {
    const result = new CombinationStatRepositoryVersionResponseDto(data);
    return result;
  }
}
export class CombinationStatRepositoryCommonResponseDto extends CombinationStatRepositoryDto {
  constructor(data: CombinationStatEntity) {
    super();
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._category = data.category;
    this._win = data.win;
    this._lose = data.lose;
    this._sampleNum = data.sampleNum;
    this._version = data.version;
    this._mainChampId = data.mainChampId;
    this._subChampId = data.subChampId;
  }
}

export class CombinationStatRepositoryRawQueryDto extends CombinationStatRepositoryDto {
  // Raw query에서 자체 생성
  @Exclude() private readonly _winrate: number;
  @Exclude() private readonly _opScore: number;
  @Exclude() private readonly _champ1_id: string;
  @Exclude() private readonly _champ1_champNameKo: string;
  @Exclude() private readonly _champ1_champNameEn: string;
  @Exclude() private readonly _champ1_champImg: string;
  @Exclude() private readonly _champ2_id: string;
  @Exclude() private readonly _champ2_champNameKo: string;
  @Exclude() private readonly _champ2_champNameEn: string;
  @Exclude() private readonly _champ2_champImg: string;
  constructor(data) {
    super();
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._category = data.category;
    this._win = data.win;
    this._lose = data.lose;
    this._sampleNum = data.sampleNum;
    this._version = data.version;
    this._winrate = data.winrate;
    this._opScore = data.opScore;
    this._champ1_id = data.champ1_id;
    this._champ1_champNameKo = data.champ1_champNameKo;
    this._champ1_champNameEn = data.champ1_champNameEn;
    this._champ1_champImg = data.champ1_champNameKo;
    this._champ2_id = data.champ2_id;
    this._champ2_champNameKo = data.champ2_champNameKo;
    this._champ2_champNameEn = data.champ2_champNameEn;
    this._champ2_champImg = data.champ2_champImg;
  }

  @Expose()
  get winrate() {
    return this._winrate;
  }

  @Expose()
  get opScore() {
    return this._opScore;
  }

  @Expose()
  get champ1_id() {
    return this._champ1_id;
  }

  @Expose()
  get champ1_champNameKo() {
    return this._champ1_champNameKo;
  }

  @Expose()
  get champ1_champNameEn() {
    return this._champ1_champNameEn;
  }

  @Expose()
  get champ1_champImg() {
    return this._champ1_champImg;
  }

  @Expose()
  get champ2_id() {
    return this._champ2_id;
  }

  @Expose()
  get champ2_champNameKo() {
    return this._champ2_champNameKo;
  }

  @Expose()
  get champ2_champNameEn() {
    return this._champ2_champNameEn;
  }

  @Expose()
  get champ2_champImg() {
    return this._champ2_champImg;
  }
}
