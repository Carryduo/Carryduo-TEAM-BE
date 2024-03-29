import { ApiProperty } from '@nestjs/swagger';

export class PreferChampUsersDTO {
  @ApiProperty({
    example: 'a98c05-9a89-40c-a378-6d7a78e13',
    description: '유저 고유id',
    required: true,
  })
  readonly userId: string;

  @ApiProperty({
    example: 'duddn',
    description: '유저 nickname',
    required: true,
  })
  readonly nickname: string;

  @ApiProperty({
    example: 'example.png',
    description: '유저 프로필 이미지',
    required: true,
  })
  readonly profileImg: string;

  @ApiProperty({
    example: 3,
    description: '유저 티어 정보',
    required: true,
  })
  readonly tier: number;
}
