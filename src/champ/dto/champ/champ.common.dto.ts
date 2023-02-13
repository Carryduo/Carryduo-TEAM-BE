import { ApiProperty } from '@nestjs/swagger';
import {
  Exclude,
  Expose,
  instanceToInstance,
  plainToClass,
  plainToInstance,
} from 'class-transformer';
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

export class ChampResDto {
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  @Expose({ name: 'id' })
  private _id: string;
  get id() {
    return this._id;
  }

  @ApiProperty({
    example: '가렌',
    description: '챔피언 한글 이름',
    required: true,
  })
  @Expose({ name: 'champNameKo' })
  private _champNameKo: string;
  get champNameKo() {
    return this._champNameKo;
  }

  @ApiProperty({
    example: 'Garen',
    description: '챔피언 영문 이름',
    required: true,
  })
  @Expose({ name: 'champNameEn' })
  private _champNameEn: string;
  get champNameEn() {
    return this._champNameEn;
  }

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 메인 이미지 url',
    required: true,
  })
  @Expose({ name: 'champMainImg' })
  private _champMainImg: string;
  get champMainImg() {
    return this._champMainImg;
  }

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 이미지 url',
    required: true,
  })
  @Expose({ name: 'champImg' })
  private _champImg: string;
  get champImg() {
    return this._champImg;
  }
}
