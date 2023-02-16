import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from '../../../summoner/entities/summoner.entity';

export class CreateSummonerDto {
  private summonerName: string;
  private summonerId: string;
  private summonerPuuId: string;
  private summonerIcon: string;
  private summonerLevel: number;

  private mostChamp1: ChampEntity;
  private mostChamp2: ChampEntity;
  private mostChamp3: ChampEntity;

  private win: number;
  private lose: number;
  private winRate: number;
  private tier: string;
  private tierImg: string;
  private lp: number;

  toEntity() {
    const summoner = new SummonerEntity();
    summoner.summonerName = this.summonerName;
    summoner.summonerId = this.summonerId;
    summoner.summonerPuuId = this.summonerPuuId;
    summoner.summonerIcon = this.summonerIcon;
    summoner.summonerLevel = String(this.summonerLevel);
    summoner.tier = this.tier;
    summoner.tierImg = this.tierImg;
    summoner.lp = this.lp;
    summoner.win = this.win ? 1 : 0;
    summoner.lose = this.lose;
    summoner.winRate = this.winRate;
    summoner.mostChamp1 = this.mostChamp1;
    summoner.mostChamp2 = this.mostChamp2;
    summoner.mostChamp3 = this.mostChamp3;
    return summoner;
  }
}
