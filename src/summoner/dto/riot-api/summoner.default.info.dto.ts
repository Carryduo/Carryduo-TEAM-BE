export class RiotSummonerDTO {
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
}

export class SummonerDataDto {
  private _summonerId: string;
  private _puuId: string;
  private _summonerLevel: number;
  private _summonerIcon: string;

  get id() {
    return this._summonerId;
  }

  get puuId() {
    return this._puuId;
  }

  static transformSummonerDataDto(data: RiotSummonerDTO) {
    const summonerData = new SummonerDataDto();
    summonerData._summonerId = data.id;
    summonerData._puuId = data.puuid;
    summonerData._summonerLevel = data.summonerLevel;
    summonerData._summonerIcon = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;
    return summonerData;
  }
}
