import { PickType } from '@nestjs/swagger';
import { SummonerCommonDTO } from '../summoner/summoner.common.dto';

export class SoloRankDataDto extends PickType(SummonerCommonDTO, [
  'win',
  'lose',
  'winRate',
  'tier',
  'tierImg',
  'lp',
]) {}
