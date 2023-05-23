import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';
import { kakaoPayload } from './kakao.payload';

export class DeleteUserReqeustDto {
  @Exclude() private readonly _userId: string;
  constructor(userId: string) {
    this._userId = userId;
  }
  get userId() {
    return this._userId;
  }

  static creatDeleteUserDto(userId: string) {
    return new DeleteUserReqeustDto(userId);
  }

  toEntity() {
    return UserEntity.createSelectOption(this._userId);
  }
}
export class FirstLoginRequestDto {
  @Exclude() private readonly _socialId: string;
  @Exclude() private readonly _social: string;
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _profileImg: string;

  constructor(data: kakaoPayload) {
    this._socialId = data.socialId;
    this._social = data.social;
    this._nickname = data.nickname;
    this._profileImg = data.profileImg;
  }

  get socialId() {
    return this._socialId;
  }

  get social() {
    return this._social;
  }

  get nickname() {
    return this._nickname;
  }

  get profileImg() {
    return this._profileImg;
  }

  static createFristLoginRequestDto(data: kakaoPayload) {
    return new FirstLoginRequestDto(data);
  }

  toEntity() {
    return UserEntity.createUserOption(
      this._socialId,
      this._social,
      this._nickname,
      this._profileImg,
    );
  }
}
