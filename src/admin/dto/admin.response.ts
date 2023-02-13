import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRepositoryBasicInfoResponseDto, UserRepositoryFirstLoginInfoResponseDto } from 'src/user/dto/user.repository.dto';

export type AdminResponseDTO = {
  userId: string;
  nickname: string;
  profileImg: string;
};

export class LoginResposeDto {
  @Exclude() private readonly _userId: string;
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _profileImg: string;

  constructor(data: UserRepositoryBasicInfoResponseDto) {
    this._userId = data.userId;
    this._nickname = data.nickname;
    this._profileImg = data.profileImg;
  }

  @Expose()
  get userId() {
    return this._userId;
  }

  @Expose()
  get nickname() {
    return this._nickname;
  }

  @Expose()
  get profileImg() {
    return this._profileImg;
  }
}
export class FirstLoginResponseDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _token: string;

  constructor(data: UserRepositoryFirstLoginInfoResponseDto, token: string) {
    this._id = data.userId;
    this._nickname = data.nickname;
    this._token = token;
  }

  @ApiProperty({
    example: 'rermedq2-1038123ndkw',
    description: '유저 고유ID',
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    example: 'nickname',
    description: '유저 닉네임',
  })
  @Expose()
  get nickname() {
    return this._nickname;
  }

  @ApiProperty({
    example: 'rermedq2-1038123ndkw',
    description: '유저 로그인 토큰',
  })
  @Expose()
  get token() {
    return this._token;
  }
}
