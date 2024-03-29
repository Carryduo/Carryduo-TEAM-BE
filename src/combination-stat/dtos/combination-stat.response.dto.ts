import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RawQueryResponseDto } from './combination-stat.repository.dto';

export class VersionResponseDto {
  @Exclude() protected _version: string;

  constructor(version: string) {
    this._version = version;
  }

  @ApiProperty({
    example: '13.1.',
    description: '패치버전',
  })
  @Expose()
  get version() {
    return this._version;
  }
}

class CombinationStatCommonResponse extends VersionResponseDto {
  @Exclude() protected _id: string;
  @Exclude() protected _category: number;
  @Exclude() protected _sampleNum: number;
  @Exclude() protected _winrate: number;
  @Exclude() protected _opScore: number;
  @Exclude() protected _champ1_id: string;
  @Exclude() protected _champ1_champNameKo: string;
  @Exclude() protected _champ1_champNameEn: string;
  @Exclude() protected _champ1_champImg: string;
  @Exclude() protected _champ2_id: string;
  @Exclude() protected _champ2_champNameKo: string;
  @Exclude() protected _champ2_champNameEn: string;
  @Exclude() protected _champ2_champImg: string;

  constructor(data: RawQueryResponseDto) {
    super(data.version);
    this._id = data.id;
    this._category = data.category;
    this._sampleNum = data.sampleNum;
    this._winrate = data.winrate;
    this._opScore = data.opScore;
    this._champ1_champImg = data.champ1_champImg;
    this._champ1_champNameEn = data.champ1_champNameEn;
    this._champ1_champNameKo = data.champ1_champNameKo;
    this._champ1_id = data.champ1_id;
    this._champ2_champImg = data.champ2_champImg;
    this._champ2_champNameEn = data.champ2_champNameEn;
    this._champ2_champNameKo = data.champ2_champNameKo;
    this._champ2_id = data.champ2_id;
  }
  @ApiProperty({
    example: 'qwwndi21n039ff890dsdf',
    description: '데이터의 고유 ID',
    required: true,
  })
  @Expose()
  get id() {
    return this._id;
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
    example: '59.11',
    description: '승률',
    required: false,
  })
  @Expose()
  get winrate() {
    if (this._winrate) return Number((this._winrate * 100).toFixed(2));
  }

  @ApiProperty({
    example: '59.11',
    description: 'opScore',
    required: false,
  })
  @Expose()
  get opScore() {
    if (this._opScore) return Number(Number(this._opScore).toFixed(2));
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
}
export class IndividualChampResponseDto extends CombinationStatCommonResponse {
  @Exclude() private readonly _position: string;

  constructor(data: RawQueryResponseDto, position: string) {
    super(data);
    this._position = position;
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
    if (this._position === 'jungle' || this._position === 'support') {
      return {
        id: this._champ2_id,
        champNameKo: this._champ2_champNameKo,
        champNameEn: this._champ2_champNameEn,
        champImg: this._champ2_champImg,
      };
    } else {
      return {
        id: this._champ1_id,
        champNameKo: this._champ1_champNameKo,
        champNameEn: this._champ1_champNameEn,
        champImg: this._champ1_champImg,
      };
    }
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
    if (this._position === 'jungle' || this._position === 'support') {
      return {
        id: this._champ1_id,
        champNameKo: this._champ1_champNameKo,
        champNameEn: this._champ1_champNameEn,
        champImg: this._champ1_champImg,
      };
    } else {
      return {
        id: this._champ2_id,
        champNameKo: this._champ2_champNameKo,
        champNameEn: this._champ2_champNameEn,
        champImg: this._champ2_champImg,
      };
    }
  }
}
export class TierListResponseDto extends CombinationStatCommonResponse {
  @Exclude() private readonly _index: number;
  constructor(data: RawQueryResponseDto, index: number) {
    super(data);
    this._index = index;
  }

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
