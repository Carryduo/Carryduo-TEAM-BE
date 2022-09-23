import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserCommonDto {
  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '유저 고유 ID',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: '2022-09-17',
    description: '생성 날짜',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-09-17',
    description: '생성 날짜',
  })
  updatedAt: Date;

  @ApiProperty({
    example: '2022-09-17',
    description: '생성 날짜',
  })
  deletedAt?: Date;

  @ApiProperty({
    example: '242787845',
    description: 'socialId',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '소셜로그인 아이디' })
  socialId: string;

  @ApiProperty({
    example: 'kakao',
    description: 'social',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '소셜 로그인 타입' })
  social: string;

  @ApiProperty({
    example: '홍길동',
    description: 'nickname',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  nickname: string;

  @ApiProperty({
    example: 'http://k.kakaocdn.net/dn/BgCup/dsdref/zsadefjdf/img_640x640.jpg',
    description: 'profileImg',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '프로필 이미지를 설정해주세요' })
  profileImg: string;

  @ApiProperty({
    example: '서폿유저 실버2입니다. 듀오 환영!',
    description: 'bio',
    required: true,
  })
  @IsString()
  bio: string | null;

  @ApiProperty({
    example: 'AD',
    description: 'preferPosition',
    required: true,
  })
  preferPosition: string | null;

  @ApiProperty({
    example: '0',
    description: 'tier',
    required: true,
  })
  tier: number | null;

  @ApiProperty({
    example: '1 or 0',
    description: 'enableChat',
    required: true,
  })
  @IsBoolean()
  enableChat: boolean;
  //

  @ApiProperty({
    example: 56,
    description: '선호챔피언1',
    required: false,
  })
  preferChamp1: string | null;

  @ApiProperty({
    example: 56,
    description: '선호챔피언2',
    required: false,
  })
  preferChamp2: string | null;

  @ApiProperty({
    example: 56,
    description: '선호챔피언3',
    required: false,
  })
  preferChamp3: string | null;
}
