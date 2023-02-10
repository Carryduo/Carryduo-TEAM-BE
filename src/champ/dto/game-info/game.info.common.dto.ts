import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { GameInfoEntity } from 'src/champ/entities/game.info.entity';

export class GameInfoDTO {
  @Exclude() private readonly _gameCount: number;
  @Exclude() private readonly _version: string;
  constructor(data: GameInfoEntity) {
    this._gameCount = data.gameCount;
    this._version = data.version;
  }

  @ApiProperty({
    example: '300',
    description: '게임 표본수',
    required: true,
  })
  @Expose()
  get gameCount() {
    return this._gameCount;
  }

  @ApiProperty({
    example: '300',
    description: '게임 표본수',
    required: true,
  })
  @Expose()
  get version() {
    return this._version;
  }
}
