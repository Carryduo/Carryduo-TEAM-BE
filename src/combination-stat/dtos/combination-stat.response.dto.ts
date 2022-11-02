import { OmitType } from '@nestjs/swagger';
import { CombinationStatCommonDto } from './combination-stat.common.dto';

export class TierListResponseDto extends CombinationStatCommonDto {}

export class IndiviudalChampResponseDto extends OmitType(
  CombinationStatCommonDto,
  ['tier', 'rankInCategory'],
) {}
