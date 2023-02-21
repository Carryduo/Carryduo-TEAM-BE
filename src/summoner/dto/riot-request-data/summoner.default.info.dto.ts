import { PickType } from '@nestjs/swagger';
import { SummonerCommonDTO } from '../summoner/summoner.common.dto';

export class SummonerDataDto extends PickType(SummonerCommonDTO, [
  'summonerId',
  'summonerPuuId',
  'summonerLevel',
  'summonerIcon',
  'summonerName',
]) {}
