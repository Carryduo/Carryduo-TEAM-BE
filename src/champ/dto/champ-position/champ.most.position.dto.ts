import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class ChampMostPositionDTO {
  @Exclude() private _position: string;

  @Expose()
  get position() {
    return this._position;
  }
  set position(position: string | undefined) {
    if (position) this._position = position;
  }

  static tranformDto(position: string | undefined) {
    const mostPosition = new ChampMostPositionDTO();
    mostPosition.position = position;
    return mostPosition;
  }
}
