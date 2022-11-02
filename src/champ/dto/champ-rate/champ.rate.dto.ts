import { PickType } from '@nestjs/swagger';
import { ChampRateCommonDTO } from './champ.rate.common.dto';

export class ChampPosition extends PickType(ChampRateCommonDTO, [
  'top',
  'jungle',
  'mid',
  'ad',
  'support',
  'version',
] as const) {}
