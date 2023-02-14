import { Expose, Transform } from 'class-transformer';

export class GetBanRateDto {
  readonly banRate: string;
}

export class ChampBanRateDto {
  @Expose()
  @Transform(({ value }) => {
    return !value ? 0 : Number(Number(value).toFixed(2));
  })
  readonly banRate: number;
}
