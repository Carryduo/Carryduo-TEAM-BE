import { PickType } from '@nestjs/swagger';
import { ChampCommonDTO } from './champ.common.dto';

export class ChampBasicInfoDTO extends PickType(ChampCommonDTO, [
  'id',
  'champNameEn',
  'champNameKo',
  'champImg',
]) {}
