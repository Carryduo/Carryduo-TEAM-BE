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
  private winRate: string = null;
  private pickRate: string = null;
  private spell1: number = null;
  private spell2: number = null;
  private version: string = null;
  static transformDto(data: GetChampRateDto | null) {
    const champRate = new GetChampRateDto();
    if (!data) return champRate;
    champRate.winRate = data.winRate;
    champRate.pickRate = data.pickRate;
    champRate.spell1 = data.spell1;
    champRate.spell2 = data.spell2;
    champRate.version = data.version;
    return champRate;
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
