import { Transform } from 'class-transformer';
import { SummonerHistoryEntity } from 'src/summoner/entities/summoner.history.entity';

const positionInfo = {
  1: 'TOP',
  2: 'JUNGLE',
  3: 'MIDDLE',
  4: 'BOTTOM',
  5: 'UTILITY',
};

export class CreateSummonerHistoryDto {
  @Transform(({ value }) => (value ? 1 : 0))
  private readonly win: boolean;
  private readonly kill: number;
  private readonly death: number;
  private readonly assist: number;
  private readonly champId: number;
  @Transform(({ value }) =>
    Number(
      Object.keys(positionInfo).find((key) => positionInfo[key] === value),
    ),
  )
  private readonly position: number;
  private readonly summonerName: string;
  private readonly summonerId: string;
  private readonly matchId: string;

  toEntity() {
    const summonerHistory = new SummonerHistoryEntity();
    summonerHistory.win = this.win;
    summonerHistory.kill = this.kill;
    summonerHistory.death = this.death;
    summonerHistory.assist = this.assist;
    summonerHistory.champId = this.champId;
    summonerHistory.position = this.position;
    summonerHistory.summonerName = this.summonerName;
    summonerHistory.summonerId = this.summonerId;
    summonerHistory.matchId = this.matchId;
    return summonerHistory;
  }
}
