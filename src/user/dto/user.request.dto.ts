import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class OptionRequestDTO extends OmitType(UserEntity, [
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
