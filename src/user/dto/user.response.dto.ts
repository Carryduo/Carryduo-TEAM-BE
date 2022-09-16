import { ApiProperty, OmitType, PickType, refs } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'wqeqwQWE244',
    description: '유저ID',
    required: false,
  })
  userId: string;
}

export class loginResponseDTO extends PickType(UserEntity, [
  'nickname',
  'profileImg',
]) {
  @ApiProperty({
    example: 'wqeqwQWE244',
    description: '유저ID',
    required: false,
  })
  userId: string;
}
