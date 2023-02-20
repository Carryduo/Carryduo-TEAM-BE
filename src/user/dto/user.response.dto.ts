import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { ChampCommonDTO } from '../../champ/dto/champ/champ.common.dto';
import { UserEntity } from '../entities/user.entity';
import { UserCommonDto } from './user.common.dto';

export class UserInfoResponseDto {
  @Exclude() protected _userId: string;
  @Exclude() protected _nickname: string;
  @Exclude() protected _profileImg: string;
  @Exclude() protected _tier: number;
  @Exclude() protected _bio: string;
  @Exclude() protected _preferPosition: string;
  @Exclude() protected _enableChat: boolean;
  @Exclude() protected _comment: CommentEntity[];
  @Exclude() protected _preferchamp1: ChampEntity;
  @Exclude() protected _preferchamp2: ChampEntity;
  @Exclude() protected _preferchamp3: ChampEntity;

  constructor(data: Partial<UserEntity>) {
    this._userId = data.userId;
    this._nickname = data.nickname;
    this._profileImg = data.profileImg;
    this._tier = data.tier;
    this._bio = data.bio;
    this._preferPosition = data.preferPosition;
    this._enableChat = data.enableChat;
    this._comment = data.comment;
    this._preferchamp1 = data.preferChamp1;
    this._preferchamp2 = data.preferChamp2;
    this._preferchamp3 = data.preferChamp3;
  }

  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '유저 고유 ID',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  @Expose()
  get userId() {
    return this._userId;
  }

  @ApiProperty({
    example: '홍길동',
    description: 'nickname',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Expose()
  get nickname() {
    return this._nickname;
  }

  @ApiProperty({
    example: 'http://k.kakaocdn.net/dn/BgCup/dsdref/zsadefjdf/img_640x640.jpg',
    description: 'profileImg',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '프로필 이미지를 설정해주세요' })
  @Expose()
  get profileImg() {
    return this._profileImg;
  }

  @ApiProperty({
    example: '0',
    description: '아이언:0, 브론즈:1, 실버:2, 골드:3, 플레:4, 다이아:5, 마스터:6, 그마:7, 챌:8',
    required: false,
  })
  @Expose()
  get tier() {
    return this._tier;
  }

  @ApiProperty({
    example: '서폿유저 실버2입니다. 듀오 환영!',
    description: 'bio',
    required: true,
  })
  @Expose()
  get bio() {
    return this._bio;
  }

  @ApiProperty({
    example: 'AD',
    description: 'preferPosition',
    required: true,
  })
  @Expose()
  get preferPosition() {
    return this._preferPosition;
  }

  @ApiProperty({
    example: '1 or 0',
    description: 'enableChat',
    required: true,
  })
  @IsBoolean()
  @Expose()
  get enableChat() {
    return this._enableChat;
  }

  @Expose()
  get comment() {
    return this._comment;
  }

  @ApiProperty({
    example: 56,
    description: '선호챔피언1',
    required: false,
  })
  @Expose()
  get preferChamp1() {
    return this._preferchamp1;
  }

  @ApiProperty({
    example: 56,
    description: '선호챔피언2',
    required: false,
  })
  @Expose()
  get preferChamp2() {
    return this._preferchamp2;
  }

  @ApiProperty({
    example: 56,
    description: '선호챔피언3',
    required: false,
  })
  @Expose()
  get preferChamp3() {
    return this._preferchamp3;
  }
}

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
