import { PickType } from '@nestjs/swagger';
import { ChampCommonDTO } from './champ.common.dto';

export class ChampBasicInfoDTO extends PickType(ChampCommonDTO, [
  'id',
  'champNameEn',
  'champNameKo',
  'champImg',
]) {}

export class ChampWinRateDTO extends PickType(ChampCommonDTO, [
  'id',
  'champNameEn',
  'champNameKo',
  'champImg',
  'winRate',
  'banRate',
  'pickRate',
]) {}
