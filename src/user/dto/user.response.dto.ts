import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ChampBasicInfoDTO } from 'src/champ/dto/champ.response.dto';
import { UserEntity } from '../entities/user.entity';

export class UserSpecificInfoResponseDTO extends OmitType(UserEntity, [
  'id',
  'createdAt',
  'socialId',
  'social',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'preferChamp1',
  'preferChamp2',
  'preferChamp3',
  'subscription',
  'comment',
]) {
  @ApiProperty({
    example: 'wqeqwQWE244',
    description: '유저ID',
    required: false,
  })
  userId: string;

  preferChamp1: ChampBasicInfoDTO | null;
  preferChamp2: ChampBasicInfoDTO | null;
  preferChamp3: ChampBasicInfoDTO | null;
}

export class UserBasicInfoResponseDTO extends PickType(UserEntity, [
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
