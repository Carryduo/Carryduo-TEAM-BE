import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { UpdateChampRateEntity } from 'src/champ/entities/update.champ.rate.entity';

export class ChampRateCommonDTO {
  @ApiProperty({
    example: '50.0',
    description: '승률',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  winRate: number;

  @ApiProperty({
    example: '50.0',
    description: '밴률',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  banRate: number;

  @ApiProperty({
    example: '50.0',
    description: '픽률',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  pickRate: number;

  @ApiProperty({
    example: '50.0',
    description: '탑 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  top: number;

  @ApiProperty({
    example: '50.0',
    description: '정글 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  jungle: number;

  @ApiProperty({
    example: '50.0',
    description: '미드 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  mid: number;

  @ApiProperty({
    example: '50.0',
    description: '원딜 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  ad: number;

  @ApiProperty({
    example: '50.0',
    description: '서포터 포지션 비율',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  support: number;

  @ApiProperty({
    example: '12.20',
    description: '게임 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version: string;
}

export class UpdateChampRateCommonDTO {
  @Exclude() private readonly _win: number;
  @Exclude() private readonly _lose: number;
  @Exclude() private readonly _position: string;
  @Exclude() private readonly _pickCount: number;
  @Exclude() private readonly _version: string;
  @Exclude() private readonly _champId: ChampEntity;

  constructor(data: UpdateChampRateEntity | null) {
    this._win = data.win;
    this._lose = data.lose;
    this._position = data.position;
    this._pickCount = data.pickCount;
    this._version = data.version;
    this._champId = data.champId;
  }
  @ApiProperty({
    example: '1',
    description: '승 수',
    required: true,
  })
  @Expose()
  get win() {
    return this._win;
  }

  @ApiProperty({
    example: '1',
    description: '패 수',
    required: true,
  })
  @Expose()
  get lose() {
    return this._lose;
  }

  @ApiProperty({
    example: 'TOP, JUNGLE, MIDDLE, BOTTOM, UTILITY',
    description: '포지션',
    required: true,
  })
  @Expose()
  get position() {
    return this._position;
  }

  @ApiProperty({
    example: '2',
    description: '챔피언 플레이 횟수',
    required: true,
  })
  @Expose()
  get pickCount() {
    return this._pickCount;
  }

  @ApiProperty({
    example: '13.1.',
    description: '플레이 게임 버전',
    required: true,
  })
  @Expose()
  get version() {
    return this._version;
  }

  @ApiProperty({
    example: '1',
    description: '챔피언 Id',
    required: true,
  })
  @Expose()
  get champId() {
    return this._champId;
  }
}
