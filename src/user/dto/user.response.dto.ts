import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ChampCommonDTO } from '../../champ/dto/champ/champ.common.dto';
import { UserCommonDto } from './user.common.dto';

export class UserSpecificInfoResponseDTO extends OmitType(UserCommonDto, ['userId', 'createdAt', 'socialId', 'social', 'createdAt', 'updatedAt', 'deletedAt', 'preferChamp1', 'preferChamp2', 'preferChamp3']) {
  @ApiProperty({
    example: 'wqeqwQWE244',
    description: '유저ID',
    required: false,
  })
  userId: string;

  @ApiProperty({
    description: '선호챔피언1 정보',
    example: {
      id: 1,
      champNameKo: '애니',
      champNameEn: 'Annie',
      champImg: '이미지url',
    },
  })
  preferChamp1: ChampCommonDTO | null;

  @ApiProperty({
    description: '선호챔피언2 정보',
    example: null,
  })
  preferChamp2: ChampCommonDTO | null;

  @ApiProperty({
    description: '선호챔피언3 정보',
    example: null,
  })
  preferChamp3: ChampCommonDTO | null;
}

export class UserBasicInfoResponseDTO extends PickType(UserCommonDto, ['nickname', 'profileImg']) {}
