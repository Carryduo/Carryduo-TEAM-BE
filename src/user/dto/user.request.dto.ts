import { UserCommonDto } from './user.common.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class OptionRequestDTO extends OmitType(UserCommonDto, [
  'userId',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'social',
  'socialId',
  'preferChamp1',
  'preferChamp2',
  'preferChamp3',
]) {
  @ApiProperty({
    example: 56,
    description: '선호챔피언3',
    required: false,
  })
  preferChamp1: string | null;

  @ApiProperty({
    example: 56,
    description: '선호챔피언3',
    required: false,
  })
  preferChamp2: string | null;

  @ApiProperty({
    example: 56,
    description: '선호챔피언3',
    required: false,
  })
  preferChamp3: string | null;
}
