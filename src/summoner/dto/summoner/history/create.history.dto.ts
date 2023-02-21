import { PickType } from '@nestjs/swagger';
import { SummonerHistoryEntity } from '../../../entities/summoner.history.entity';
import { SummonerHistoryCommonDto } from './history.common.dto';

export class CreateSummonerHistoryDto extends PickType(SummonerHistoryCommonDto, [
  'win',
  'kill',
  'death',
  'assist',
  'champId',
  'position',
  'summonerName',
  'summonerId',
  'matchId',
]) {
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
