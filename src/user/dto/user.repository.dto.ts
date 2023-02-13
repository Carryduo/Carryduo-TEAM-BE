import { Exclude, Expose } from 'class-transformer';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { UserEntity } from '../entities/user.entity';

export class UserRepositoryDto {
  @Exclude() protected _userId: string;
  @Exclude() protected _socialId: string;
  @Exclude() protected _social: string;
  @Exclude() protected _nickname: string;
  @Exclude() protected _profileImg: string;
  @Exclude() protected _bio: string;
  @Exclude() protected _preferPosition: string;
  @Exclude() protected _tier: number;
  @Exclude() protected _enableChat: boolean;
  @Exclude() protected _preferChamp1: ChampEntity;
  @Exclude() protected _preferChamp2: ChampEntity;
  @Exclude() protected _preferChamp3: ChampEntity;

  @Expose()
  get userId() {
    return this._userId;
  }

  @Expose()
  get socialId() {
    return this._socialId;
  }

  @Expose()
  get social() {
    return this._social;
  }

  @Expose()
  get nickname() {
    return this._nickname;
  }

  @Expose()
  get profileImg() {
    return this._profileImg;
  }

  @Expose()
  get bio() {
    return this._bio;
  }

  @Expose()
  get preferPosition() {
    return this._preferPosition;
  }

  @Expose()
  get tier() {
    return this._tier;
  }

  @Expose()
  get enableChat() {
    return this._enableChat;
  }

  @Expose()
  get preferChamp1() {
    return this._preferChamp1;
  }

  @Expose()
  get preferChamp2() {
    return this._preferChamp2;
  }

  @Expose()
  get preferChamp3() {
    return this._preferChamp3;
  }
}

export class UserRepositoryBasicInfoResponseDto extends UserRepositoryDto {
  constructor(data: { userId: string; nickname: string; profileImg: string }) {
    super();
    this._userId = data.userId;
    this._nickname = data.nickname;
    this._profileImg = data.profileImg;
  }
}

export class UserRepositoryFirstLoginInfoResponseDto extends UserRepositoryDto {
  constructor(data: { userId: string; nickname: string }) {
    super();
    this._userId = data.userId;
    this._nickname = data.nickname;
  }
}
