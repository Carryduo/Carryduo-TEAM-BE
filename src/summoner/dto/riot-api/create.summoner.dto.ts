import { ChampEntity } from '../../../champ/entities/champ.entity';
import { SummonerEntity } from '../../../summoner/entities/summoner.entity';
import { MostChampDataDto } from './most.champ.info.dto';
import { SoloRankDataDto } from './solo.rank.info.dto';
import { SummonerDataDto } from './summoner.default.info.dto';
export class createSummonerDto {
  private summonerName: string;
  private summonerId: string;
  private summonerIcon: string;
  private summonerLevel: number;

  private tier: string;
  private tierImg: string;
  private lp: number;
  private lose: number;
  private win: number;
  private winRate: number;

  private mostChamp1: ChampEntity;
  private mostChamp2: ChampEntity;
  private mostChamp3: ChampEntity;
  constructor(summoner: SummonerDataDto, rankInfo: SoloRankDataDto, mostChamps: MostChampDataDto) {
    this.summonerName = summoner.summonerName;
    this.summonerId = summoner.summonerId;
    this.summonerIcon = summoner.summonerIcon;
    this.summonerLevel = summoner.summonerLevel;

    this.tier = rankInfo.tier;
    this.tierImg = rankInfo.tierImg;
    this.lp = rankInfo.lp;
    this.win = rankInfo.win;
    this.lose = rankInfo.lose;
    this.winRate = rankInfo.winRate;

    this.mostChamp1 = mostChamps.mostChamp1;
    this.mostChamp2 = mostChamps.mostChamp2;
    this.mostChamp3 = mostChamps.mostChamp3;
  }

  toEntity() {
    const summoner = new SummonerEntity();
    summoner.summonerName = this.summonerName;
    summoner.summonerId = this.summonerId;
    summoner.summonerIcon = this.summonerIcon;
    summoner.summonerLevel = String(this.summonerLevel);
    summoner.tier = this.tier;
    summoner.tierImg = this.tierImg;
    summoner.lp = this.lp;
    summoner.win = this.win ? 1 : 0;
    summoner.lose = this.lose;
    summoner.winRate = this.winRate;
    summoner.mostChamp1 = this.mostChamp1;
    summoner.mostChamp1 = this.mostChamp2;
    summoner.mostChamp3 = this.mostChamp3;
    return summoner;
  }
}
