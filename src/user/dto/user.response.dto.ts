import { OmitType, PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class optionResponseDTO extends OmitType(UserEntity, [
  'id',
  'createdAt',
  'socialId',
  'social',
  'createdAt',
  'updatedAt',
  'deletedAt',
]) {
  userId: string;
}

export class loginResponseDTO extends PickType(UserEntity, [
  'nickname',
  'profileImg',
]) {
  userId: string;
}
