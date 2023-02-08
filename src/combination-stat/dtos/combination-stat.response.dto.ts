import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CombinationStatCommonDto } from './combination-stat.common.dto';

export class TierListDto {
  @Exclude() private readonly _category: number;
  @Exclude() private readonly _sampleNum: number;
  @Exclude() private readonly _version: string;
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
  @Exclude() private readonly _index: number;

  constructor(data: CombinationStatCommonDto, index: number) {
    this._category = data.category;
    this._sampleNum = data.sampleNum;
    this._version = data.version;
    this._winrate = data.winrate;
    this._opScore = data.opScore;
    this._champ1_id = data.champ1_id;
    this._champ1_champNameKo = data.champ1_champNameKo;
    this._champ1_champNameEn = data.champ1_champNameEn;
    this._champ1_champImg = data.champ1_champImg;
    this._champ2_id = data.champ2_id;
    this._champ2_champNameKo = data.champ2_champNameKo;
    this._champ2_champNameEn = data.champ2_champNameEn;
    this._champ2_champImg = data.champ2_champImg;
    this._index = index;
  }

  @ApiProperty({
    example: '0(top-jungle)/1(mid-jungle)/2(ad-support)',
    description: '조합승률을 보여줄 라인 기준',
    required: false,
  })
  @Expose()
  get category() {
    return this._category;
  }

  @ApiProperty({
    example: '595',
    description: '표본수',
    required: false,
  })
  @Expose()
  get sampleNum() {
    return this._sampleNum;
  }

  @ApiProperty({
    example: '13.1.',
    description: '패치버전',
  })
  @Expose()
  get version() {
    return this._version;
  }

  @ApiProperty({
    example: '59.11',
    description: '승률',
    required: false,
  })
  @Expose()
  get winrate() {
    return Number((this._winrate * 100).toFixed(2));
  }

  @ApiProperty({
    example: '59.11',
    description: 'opScore',
    required: false,
  })
  @Expose()
  get opScore() {
    return Number(Number(this._opScore).toFixed(2));
  }

  @ApiProperty({
    example: {
      id: '875',
      champNameKo: '세트',
      champNameEn: 'Sett',
      champImg: '이미지 url',
    },
    description: '기준 챔피언 정보',
    required: false,
  })
  @Expose()
  get mainChampId() {
    return {
      id: this._champ1_id,
      champNameKo: this._champ1_champNameKo,
      champNameEn: this._champ1_champNameEn,
      champImg: this._champ1_champImg,
    };
  }

  @ApiProperty({
    example: {
      id: '875',
      champNameKo: '세트',
      champNameEn: 'Sett',
      champImg: '이미지 url',
    },
    description: '기타 챔피언 정보',
    required: false,
  })
  @Expose()
  get subChampId() {
    return {
      id: this._champ2_id,
      champNameKo: this._champ2_champNameKo,
      champNameEn: this._champ2_champNameEn,
      champImg: this._champ2_champImg,
    };
  }

  @ApiProperty({
    example: '1',
    description: '조합승률 데이터의 티어',
    required: false,
  })
  @Expose()
  get tier() {
    if (this._index <= 2) {
      return 1;
    } else if (3 <= this._index && this._index <= 9) {
      return 2;
    } else if (10 <= this._index && this._index <= 19) {
      return 3;
    } else if (20 <= this._index && this._index <= 26) {
      return 4;
    } else {
      return 5;
    }
  }
}
export class sampleDto extends OmitType(CombinationStatCommonDto, ['champ1_champImg', 'champ1_champNameEn', 'champ1_champNameKo', 'champ1_id', 'champ2_champImg', 'champ2_champNameEn', 'champ2_champNameKo', 'champ2_id']) {
  @ApiProperty({
    example: '1',
    description: '조합승률 데이터의 티어',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  tier: number;

  @ApiProperty({
    example: {
      id: '875',
      champNameKo: '세트',
      champNameEn: 'Sett',
      champImg: '이미지 url',
    },
    description: '기준 챔피언 정보',
    required: false,
  })
  mainChampId: {
    id: string;
    champNameKo: string;
    champNameEn: string;
    champImg: string;
  };

  @ApiProperty({
    example: {
      id: '203',
      champNameKo: '킨드레드',
      champNameEn: 'Kindred',
      champImg: '이미지 url',
    },
    description: '조합 챔피언 정보',
    required: false,
  })
  subChampId: {
    id: string;
    champNameKo: string;
    champNameEn: string;
    champImg: string;
  };
}

export class IndiviudalChampResponseDto extends OmitType(sampleDto, ['tier']) {}

export class VersionResponseDto extends PickType(CombinationStatCommonDto, ['version']) {}
