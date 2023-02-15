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
  readonly winRate: string | number;
  readonly pickRate: string | number;
  readonly spell1: number;
  readonly spell2: number;
  readonly version: string;
}

export class ChampRateDataDto {
  private _winRate: number;
  private _pickRate: number;
  private _spell1Img: string;
  private _spell2Img: string;
  private _version: string;
  get winRate() {
    return this._winRate;
  }
  set winRate(winRate: number) {
    this._winRate = winRate;
  }

  get pickRate() {
    return this._pickRate;
  }
  set pickRate(pickRate: number) {
    this._pickRate = pickRate;
  }

  get spell1Img() {
    return this._spell1Img;
  }
  set spell1Img(spell1: string) {
    this._spell1Img = spell1;
  }

  get spell2Img() {
    return this._spell2Img;
  }
  set spell2Img(spell2: string) {
    this._spell2Img = spell2;
  }

  get version() {
    return this._version;
  }
  set version(verison: string) {
    this._version = verison;
  }

  static transform(data: GetChampRateDto[]) {
    const champRate = new ChampRateDataDto();
    champRate.winRate = data[0]?.winRate ? Number(Number(data[0].winRate).toFixed(2)) : 0;
    champRate.pickRate = data[0]?.pickRate ? Number(Number(data[0].pickRate).toFixed(2)) : 0;
    champRate.spell1Img = data[0]?.spell1 ? spellInfo[data[0]?.spell1] : spellInfo.default;
    champRate.spell2Img = data[0]?.spell2 ? spellInfo[data[0]?.spell2] : spellInfo.default;
    champRate.version = data[0]?.version ? data[0]?.version : 'default version';
    return champRate;
  }
}
