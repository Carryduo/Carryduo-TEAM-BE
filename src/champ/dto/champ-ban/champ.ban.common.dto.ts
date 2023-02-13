import { Exclude, Expose } from 'class-transformer';

export class ChampBanRateDto {
  @Exclude() private _banRate: number = 0;

  @Expose()
  get banRate() {
    return this._banRate;
  }
  set banRate(banData: number) {
    if (!isNaN(banData) && banData !== 0) {
      this._banRate = Number(banData.toFixed(2));
    }
  }
  static tranformDto(banData: number) {
    const banInfo = new ChampBanRateDto();
    banInfo.banRate = banData;
    return banInfo;
  }
}
