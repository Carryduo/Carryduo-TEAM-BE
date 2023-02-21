import { PickType } from '@nestjs/swagger';
import { SummonerCommonDTO } from '../summoner/summoner.common.dto';

export class MostChampDataDto extends PickType(SummonerCommonDTO, [
  'mostChamp1',
  'mostChamp2',
  'mostChamp3',
]) {}
