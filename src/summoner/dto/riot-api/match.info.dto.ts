import { Transform } from 'class-transformer';

const positionInfo = {
  1: 'TOP',
  2: 'JUNGLE',
  3: 'MIDDLE',
  4: 'BOTTOM',
  5: 'UTILITY',
};

export class SummonerHistoryDTO {
  private readonly win: boolean;
  private readonly kill: number;
  private readonly death: number;
  private readonly assist: number;
  private readonly champId: number;
  @Transform(({ value }) =>
    Number(Object.keys(positionInfo).find((key) => positionInfo[key] === value)),
  )
  private readonly position: string;
  private readonly summonerName: string;
  private readonly summonerId: string;
  private readonly matchId: string;
}
