export class ChampionMasteryDto {
  championPointsUntilNextLevel: number;
  chestGranted: number;
  championId: number;
  lastPlayTime: number;
  championLevel: number;
  summonerId: string;
  championPoints: number;
  championPointsSinceLastLevel: number;
  tokensEarned: number;
}

export class MostChampDataDto {
  mostChamp1: number;
  mostChamp2: number;
  mostChamp3: number;

  static transformMostChampData(data: ChampionMasteryDto[]) {
    const mostChamp = new MostChampDataDto();
    mostChamp.mostChamp1 = data[0]?.championId ? data[0]?.championId : null;
    mostChamp.mostChamp2 = data[1]?.championId ? data[1]?.championId : null;
    mostChamp.mostChamp3 = data[2]?.championId ? data[2]?.championId : null;
    return mostChamp;
  }
}
