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
  summonerId: string;
  puuId: string;
  summonerLevel: number;
  summonerIcon: string;
  summonerName: string;

  static transformSummonerDataDto(data: RiotSummonerDTO) {
    const summonerData = new SummonerDataDto();
    summonerData.summonerId = data.id;
    summonerData.puuId = data.puuid;
    summonerData.summonerLevel = data.summonerLevel;
    summonerData.summonerIcon = `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${data.profileIconId}.png`;
    summonerData.summonerName = data.name;
    return summonerData;
  }
}
