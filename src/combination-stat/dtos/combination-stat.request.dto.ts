import { CombinationStatEntity } from './../entities/combination-stat.entity';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CategoryParamDto {
  @IsString()
  @IsNotEmpty()
  category: 'top-jungle' | 'mid-jungle' | 'ad-support';

  toTierListRequestDto() {
    return TierListRequestDto.createDto(this.category);
  }
}

export class IndividualChampParamDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  position: 'top' | 'jungle' | 'mid' | 'ad' | 'support';

  toIndividualChampRequestDto() {
    return IndividualChampRequestDto.craeteDto(this.category, this.position);
  }
}

export class TierListRequestDto {
  @Exclude() protected _category: 'top-jungle' | 'mid-jungle' | 'ad-support';

  constructor(category: 'top-jungle' | 'mid-jungle' | 'ad-support') {
    this._category = category;
  }

  static createDto(category: 'top-jungle' | 'mid-jungle' | 'ad-support') {
    return new TierListRequestDto(category);
  }

  @Expose()
  get category() {
    return this._category;
  }

  toEntity(version: string): CombinationStatEntity {
    let category: number;
    switch (this._category) {
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
    return CombinationStatEntity.createSelectOption({ category, version });
  }
}

export class IndividualChampRequestDto {
  @Exclude() private readonly _position: 'top' | 'jungle' | 'mid' | 'ad' | 'support';
  @Exclude() private readonly _champId: string;
  constructor(champId: string, position: 'top' | 'jungle' | 'mid' | 'ad' | 'support') {
    this._champId = champId;
    this._position = position;
  }
  static craeteDto(champId: string, position: 'top' | 'jungle' | 'mid' | 'ad' | 'support') {
    return new IndividualChampRequestDto(champId, position);
  }

  @Expose()
  get position() {
    return this._position;
  }

  @Expose()
  get champId() {
    return this._champId;
  }

  toEntity(version: string) {
    return CombinationStatEntity.createSelectOption({ version });
  }
}
