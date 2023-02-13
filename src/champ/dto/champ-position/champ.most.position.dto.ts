import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

export class ChampMostPositionDTO {
  @Expose()
  @Transform(({ value }) => {
    return !value ? 'default position' : value;
  })
  readonly position: string;
}
