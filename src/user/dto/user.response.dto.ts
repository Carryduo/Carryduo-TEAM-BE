import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ChampBasicInfoDTO } from 'src/champ/dto/champ.response.dto';
import { UserEntity } from '../entities/user.entity';

export class OptionResponseDTO extends OmitType(UserEntity, [
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
]) {
  @ApiProperty({
    example: 'wqeqwQWE244',
    description: '유저ID',
    required: false,
  })
  userId: string;

  preferChamp1: ChampBasicInfoDTO;
  preferChamp2: ChampBasicInfoDTO;
  preferChamp3: ChampBasicInfoDTO;
}

export class LoginResponseDTO extends PickType(UserEntity, [
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
