import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChampRateDataDto } from '../champ-rate/champ.rate.dto';
import { ChampSkillCommonDTO } from '../champ-skill/champ.skill.common.dto';
import { ChampCommonDTO } from '../champ/champ.common.dto';

export class TargetChampionResDto {
  @Exclude() private _id: string;
  @Exclude() private _champNameKo: string;
  @Exclude() private _champNameEn: string;
  @Exclude() private _champImg: string;
  @Exclude() private _winRate: number;
  @Exclude() private _banRate: number;
  @Exclude() private _pickRate: number;
  @Exclude() private _position: string;
  @Exclude() private _spell1Img: string;
  @Exclude() private _spell2Img: string;
  @Exclude() private _version: string;
  @Exclude() private _skill: ChampSkillCommonDTO[];

  constructor(
    champDefault: ChampCommonDTO,
    champSkill: ChampSkillCommonDTO[],
    champRate: ChampRateDataDto,
    champBanRate: number,
    champPosition: string,
  ) {
    this._id = champDefault.id;
    this._champNameKo = champDefault.champNameKo;
    this._champNameEn = champDefault.champNameEn;
    this._champImg = champDefault.champImg;
    this._winRate = champRate.winRate;
    this._pickRate = champRate.pickRate;
    this._spell1Img = champRate.spell1Img;
    this._spell2Img = champRate.spell2Img;
    this._version = champRate.version;
    this._banRate = champBanRate;
    this._position = champPosition;
    this._skill = champSkill;
  }
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    example: '가렌',
    description: '챔피언 한글 이름',
    required: true,
  })
  @Expose()
  get champNameKo() {
    return this._champNameKo;
  }

  @ApiProperty({
    example: 'Garen',
    description: '챔피언 영문 이름',
    required: true,
  })
  @Expose()
  get champNameEn() {
    return this._champNameEn;
  }

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 이미지 url',
    required: true,
  })
  @Expose()
  get champImg() {
    return this._champImg;
  }

  @ApiProperty({
    example: 48.45,
    description: '승률',
    required: true,
  })
  @Expose()
  get winRate() {
    return this._winRate;
  }

  @ApiProperty({
    example: 13.2,
    description: '밴 비율',
    required: true,
  })
  @Expose()
  get banRate() {
    return this._banRate;
  }

  @ApiProperty({
    example: 8.19,
    description: '픽률',
    required: true,
  })
  @Expose()
  get pickRate() {
    return this._pickRate;
  }
  @ApiProperty({
    example: 'spell1 image.png',
    description: '첫번째 스펠이미지',
    required: true,
  })
  @Expose()
  get spell1Img() {
    return this._spell1Img;
  }
  @ApiProperty({
    example: 'spell2 image.png',
    description: '두번째 스펠이미지',
    required: true,
  })
  @Expose()
  get spell2Img() {
    return this._spell2Img;
  }
  @ApiProperty({
    example: '13.3.',
    description: '버전 정보',
    required: true,
  })
  @Expose()
  get version() {
    return this._version;
  }
  @ApiProperty({
    example: 'BOTTOM',
    description: '포지션',
    required: true,
  })
  @Expose()
  get position() {
    return this._position;
  }
  @ApiProperty({
    description: '챔피언 스킬 정보',
    isArray: true,
    type: ChampSkillCommonDTO,
  })
  @Expose()
  get skill() {
    return this._skill;
  }
}
