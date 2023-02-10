import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChampBanEntity } from 'src/champ/entities/champ.ban.entity';
import { ChampEntity } from 'src/champ/entities/champ.entity';

export class ChampBanCommonDTO {
  @Exclude() private readonly _banCount: number;
  @Exclude() private readonly _version: string;
  @Exclude() private readonly _champId: ChampEntity;

  constructor(data: ChampBanEntity | null) {
    this._banCount = data.banCount;
    this._version = data.version;
    this._champId = data.champId;
  }

  @ApiProperty({
    example: '30',
    description: '밴 당한 횟수',
    required: true,
  })
  @Expose()
  get banCount() {
    return this._banCount;
  }

  @ApiProperty({
    example: '12.20',
    description: '밴 당한 게임 버전',
    required: true,
  })
  @Expose()
  get version() {
    return this._version;
  }

  @ApiProperty({
    example: '1',
    description: '밴 당한 챔피언id',
    required: true,
  })
  @Expose()
  get champId() {
    return this._champId;
  }
}
