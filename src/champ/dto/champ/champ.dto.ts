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

export class champDataDTO {
  championId: number;
  championNameEn: string;
  championNameKo: string;
  championMainImg: string;
  championImg: string;
}

export class champSkillDTO {
  id: string;
  name: string;
  desc: string;
  tooltip: string;
  image: string;
}

export class champPassiveSkillDTO {
  id: string;
  name: string;
  desc: string;
  image: string;
}
