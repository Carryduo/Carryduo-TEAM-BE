import { UserEntity } from '../..//user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ChampEntity } from '../..//champ/entities/champ.entity';
import { IsBoolean, IsNumber, IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class GetOtherUserInfoRequestDto {
  @ApiProperty({
    example: 'qwndwqkdoi21io3213',
    description: '유저 고유ID',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  toGetUserInfoRequestDto(category: string) {
    return new GetUserInfoRequestDto(category, this.id);
  }
}
export class UpdateUserOptionRequestBodyDto {
  @ApiProperty({
    example: '홍길동',
    description: 'nickname',
    required: true,
  })
  @IsString()
  @IsOptional()
  nickname?: string | null;

  @ApiProperty({
    example: 'http://k.kakaocdn.net/dn/BgCup/dsdref/zsadefjdf/img_640x640.jpg',
    description: 'profileImg',
    required: true,
  })
  @IsString()
  @IsOptional()
  profileImg?: string | null;

  @ApiProperty({
    example: '서폿유저 실버2입니다. 듀오 환영!',
    description: 'bio',
    required: true,
  })
  @IsString()
  @IsOptional()
  bio?: string | null;

  @ApiProperty({
    example: 'AD',
    description: 'preferPosition',
    required: true,
  })
  @IsString()
  @IsOptional()
  preferPosition?: string | null;

  @ApiProperty({
    example: '0',
    description: '아이언:0, 브론즈:1, 실버:2, 골드:3, 플레:4, 다이아:5, 마스터:6, 그마:7, 챌:8',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  tier?: number | null;

  @ApiProperty({
    example: '1 or 0',
    description: 'enableChat',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  enableChat?: boolean | null;

  @ApiProperty({
    example: 56,
    description: '선호챔피언1',
    required: false,
  })
  @IsString()
  @IsOptional()
  preferChamp1?: string | null;

  @ApiProperty({
    example: 56,
    description: '선호챔피언1',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  preferChamp2?: string | null;

  @ApiProperty({
    example: 56,
    description: '선호챔피언1',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  preferChamp3?: string | null;
}
export class GetUserInfoRequestDto {
  @Exclude() private readonly _category: string;
  @Exclude() private readonly _userId: string;

  constructor(category: string, userId: string) {
    this._category = category;
    this._userId = userId;
  }

  get category() {
    return this._category;
  }

  get userId() {
    return this._userId;
  }

  static createDto(category: string, userId: string) {
    return new GetUserInfoRequestDto(category, userId);
  }

  toEntity() {
    return UserEntity.createSelectOption(this._userId);
  }
}

export class UpdateUserOptionRequestDto {
  private _userId: string;
  private _nickname?: string | null;
  private _profileImg?: string | null;
  private _bio?: string | null;
  private _preferPosition?: string | null;
  private _tier?: number | null;
  private _enableChat?: boolean | null;
  private _preferChamp1?: string | null;
  private _preferChamp2?: string | null;
  private _preferChamp3?: string | null;

  constructor(userId: string, body: UpdateUserOptionRequestBodyDto) {
    this._userId = userId;
    this._nickname = body.nickname;
    this._profileImg = body.profileImg;
    this._bio = body.bio;
    this._preferPosition = body.preferPosition;
    this._tier = body.tier;
    this._enableChat = body.enableChat;
    this._preferChamp1 = body.preferChamp1;
    this._preferChamp2 = body.preferChamp2;
    this._preferChamp3 = body.preferChamp3;
  }

  static createDto(userId: string, body: UpdateUserOptionRequestBodyDto) {
    return new UpdateUserOptionRequestDto(userId, body);
  }

  toEntity(): UserEntity {
    const champ1 = ChampEntity.createChampIdOption(this._preferChamp1);
    const champ2 = ChampEntity.createChampIdOption(this._preferChamp2);
    const champ3 = ChampEntity.createChampIdOption(this._preferChamp3);
    return UserEntity.createUpdateOption({
      userId: this._userId,
      nickname: this._nickname,
      profileImg: this._profileImg,
      bio: this._bio,
      preferPosition: this._preferPosition,
      tier: this._tier,
      enableChat: this._enableChat,
      preferChamp1: champ1,
      preferChamp2: champ2,
      preferChamp3: champ3,
    });
  }

  // TODO: preferchamp는 champentity로 속성 바꾸기
  // toEntity() {}
}
