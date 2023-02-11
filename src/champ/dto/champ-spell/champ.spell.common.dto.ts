import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { UpdateChampSpellEntity } from 'src/champ/entities/update.champ.spell.entity';

export class ChampSpellCommonDTO {
  @Exclude() private readonly _spell1: number;
  @Exclude() private readonly _spell2: number;
  @Exclude() private readonly _playCount: number;
  @Exclude() private readonly _version: string;
  @Exclude() private readonly _position: string;
  @Exclude() private readonly _champId: ChampEntity;

  constructor(data: UpdateChampSpellEntity | null) {
    this._spell1 = data.spell1;
    this._spell2 = data.spell2;
    this._playCount = data.playCount;
    this._version = data.version;
    this._position = data.position;
    this._champId = data.champId;
  }

  @ApiProperty({
    example: '1',
    description: 'spell Id',
    required: true,
  })
  @Expose()
  get spell1() {
    return this._spell1;
  }

  @ApiProperty({
    example: '2',
    description: 'spell Id',
    required: true,
  })
  @Expose()
  get spell2() {
    return this._spell2;
  }

  @ApiProperty({
    example: '5',
    description: 'spell1, spell2에 해당하는 게임수',
    required: true,
  })
  @Expose()
  get playCount() {
    return this._playCount;
  }

  @ApiProperty({
    example: '12.20',
    description: '게임 버전',
    required: true,
  })
  @Expose()
  get version() {
    return this._version;
  }

  @ApiProperty({
    example: 'top',
    description: '포지션',
    required: true,
  })
  @Expose()
  get position() {
    return this._position;
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
