import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';

export class ChampCommonDTO {
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '가렌',
    description: '챔피언 한글 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champNameKo: string;

  @ApiProperty({
    example: 'Garen',
    description: '챔피언 영문 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champNameEn: string;

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 메인 이미지 url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champMainImg: string;

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 이미지 url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champImg: string;
}

export class ChampDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _champNameKo: string;
  @Exclude() private readonly _champNameEn: string;
  @Exclude() private readonly _champMainImg: string;
  @Exclude() private readonly _champImg: string;
  constructor(data: ChampEntity | null) {
    this._id = data.id;
    this._champNameKo = data.champNameKo;
    this._champNameEn = data.champNameEn;
    this._champMainImg = data.champMainImg;
    this._champImg = data.champImg;
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
    description: '챔피언 메인 이미지 url',
    required: true,
  })
  @Expose()
  get champMainImg() {
    return this._champMainImg;
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

  static transformDTO(champList: ChampEntity[]) {
    return champList.map((v) => new ChampDto(v));
  }
}
