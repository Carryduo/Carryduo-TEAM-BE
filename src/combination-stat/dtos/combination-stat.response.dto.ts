import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CombinationStatCommonDto } from './combination-stat.common.dto';

export class TierListResponseDto extends CombinationStatCommonDto {}

export class IndiviudalChampResponseDto extends OmitType(CombinationStatCommonDto, ['tier']) {}

export class VersionResponseDto {
  @ApiProperty({
    example: '13.1.',
    description: '패치버전',
  })
  version: string;
}
