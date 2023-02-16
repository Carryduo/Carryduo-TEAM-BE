export class SummonerRecordSumData {
  winCount: string;
  killCount: string;
  deathCount: string;
  assistCount: string;
  totalCount: string;
}

export class SummonerHistoryRateDto {
  kill: number;
  death: number;
  assist: number;
  KDA: number;
  total: number;
  win: number;
  lose: number;
  winRate: number;
  positions: SummonerPositionDto;

  static plainToSummonerHistoryRateDto(data: SummonerRecordSumData) {
    const history = new SummonerHistoryRateDto();
    history.kill = Number(data.killCount) / Number(data.totalCount);
    history.death = Number(data.deathCount) / Number(data.totalCount);
    history.assist = Number(data.assistCount) / Number(data.totalCount);
    history.KDA = Number(
      ((Number(data.killCount) + Number(data.assistCount)) / Number(data.deathCount)).toFixed(2),
    );
    history.total = Number(data.totalCount);
    history.win = Number(data.winCount);
    history.lose = Number(data.totalCount) - Number(data.winCount);
    history.winRate = Math.floor((Number(data.winCount) / Number(data.totalCount)) * 100);
    return history;
  }
}

export class SummonerPositionDto {
  positions: { id: number; cnt: number }[];

  static plainToSummonerPositionDto(data: { id: number; cnt: string }[]) {
    const summonerPosition = new SummonerPositionDto();

    const positionId = [1, 2, 3, 4, 5];
    let positions: { id: number; cnt: number }[] = [];

    for (let d of data) {
      if (positionId.includes(d.id)) {
        positionId.splice(positionId.indexOf(d.id), 1);
        positions.push({ id: d.id, cnt: Number(d.cnt) });
      }
    }
    for (let pI of positionId) {
      positions.push({ id: pI, cnt: 0 });
    }
    positions.sort((a, b) => a.id - b.id);

    summonerPosition.positions = positions;
    return summonerPosition;
  }
}
