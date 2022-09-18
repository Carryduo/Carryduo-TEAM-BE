import { PickType } from '@nestjs/swagger';
import { ChampEntity } from '../entities/champ.entity';

export class ChampBasicInfoDTO extends PickType(ChampEntity, [
  'id',
  'champNameEn',
  'champNameKo',
  'champImg',
]) {}
