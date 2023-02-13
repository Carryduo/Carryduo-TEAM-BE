import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from 'src/user/entities/user.entity';

export class preferChampUsersResDTO {
  @Exclude() private readonly _userId: string;
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _profileImge: string;
  @Exclude() private readonly _tier: number;

  constructor(data: UserEntity) {
    this._userId = data.userId;
    this._nickname = data.nickname;
    this._profileImge = data.profileImg;
    this._tier = data.tier;
  }

  @ApiProperty({
    example: 'a98c05-9a89-40c-a378-6d7a78e13',
    description: '유저 고유id',
    required: true,
  })
  @Expose()
  get userId() {
    return this._userId;
  }

  @ApiProperty({
    example: 'duddn',
    description: '유저 nickname',
    required: true,
  })
  @Expose()
  get nickname() {
    return this._nickname;
  }

  @ApiProperty({
    example: 'example.png',
    description: '유저 프로필 이미지',
    required: true,
  })
  @Expose()
  get profileImg() {
    return this._profileImge;
  }

  @ApiProperty({
    example: 3,
    description: '유저 티어 정보',
    required: true,
  })
  @Expose()
  get tier() {
    return this._tier;
  }
}
