import { Expose, Transform } from 'class-transformer';

const spellInfo = {
  21: 'SummonerBarrier',
  1: 'SummonerBoost',
  14: 'SummonerDot',
  3: 'SummonerExhaust',
  4: 'SummonerFlash',
  6: 'SummonerHaste',
  7: 'SummonerHeal',
  13: 'SummonerMana',
  11: 'SummonerSmite',
  12: 'SummonerTeleport',
  default: 'default spell Image',
};

export class GetChampRateDto {
  readonly winRate: string = null;
  readonly pickRate: string = null;
  readonly spell1: number = null;
  readonly spell2: number = null;
  readonly version: string = null;
  constructor(partial: Partial<GetChampRateDto>) {
    if (partial) Object.assign(this, partial);
  }
}

export class ChampRateDataDto {
  @Transform(({ value }) => {
    return value ? Number(Number(value).toFixed(2)) : 0;
  })
  readonly winRate: number;

  @Transform(({ value }) => {
    return value ? Number(Number(value).toFixed(2)) : 0;
  })
  readonly pickRate: number;

  @Expose({ name: 'spell1' })
  @Transform(({ value }) => {
    return value ? spellInfo[value] : spellInfo.default;
  })
  readonly spell1Img: string;

  @Expose({ name: 'spell2' })
  @Transform(({ value }) => {
    return value ? spellInfo[value] : spellInfo.default;
  })
  readonly spell2Img: string;

  @Transform(({ value }) => {
    return value ? value : 'default version';
  })
  readonly version: string;
}
