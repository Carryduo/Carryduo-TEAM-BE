import { UserCommonDto } from './user.common.dto';
import { OmitType } from '@nestjs/swagger';

export class OptionRequestDTO extends OmitType(UserCommonDto, [
  'userId',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'social',
  'socialId',
]) {}
