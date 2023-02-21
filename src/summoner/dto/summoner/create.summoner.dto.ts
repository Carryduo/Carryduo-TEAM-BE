import { OmitType } from '@nestjs/swagger';
import { SummonerEntity } from '../../entities/summoner.entity';
import { SummonerCommonDTO } from './summoner.common.dto';

export class CreateSummonerDto extends OmitType(SummonerCommonDTO, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {
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
    summoner.win = this.win;
    summoner.lose = this.lose;
    summoner.winRate = this.winRate;
    summoner.mostChamp1 = this.mostChamp1;
    summoner.mostChamp2 = this.mostChamp2;
    summoner.mostChamp3 = this.mostChamp3;
    return summoner;
  }
}
