import { PickType } from '@nestjs/swagger';
import { SummonerCommonDTO } from './summoner.common.dto';

export class SummonerDBResponseDTO extends PickType(SummonerCommonDTO, [
  'summonerName',
  'summonerIcon',
  'summonerLevel',
  'tier',
  'tierImg',
  'lp',
  'win',
  'lose',
  'winRate',
  'mostChamp1',
  'mostChamp2',
  'mostChamp3',
]) {}
