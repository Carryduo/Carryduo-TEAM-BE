import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class preferChampUsersResDTO {
  @IsNotEmpty()
  name: string;
  // @ApiProperty({
  //   example: 'a98c05-9a89-40c-a378-6d7a78e13',
  //   description: '유저 고유id',
  //   required: true,
  // })
  // @Expose()
  // readonly asdasdasd: string;
  // @ApiProperty({
  //   example: 'duddn',
  //   description: '유저 nickname',
  //   required: true,
  // })
  // // @Expose()
  // // readonly nickname: string;
  // @ApiProperty({
  //   example: 'example.png',
  //   description: '유저 프로필 이미지',
  //   required: true,
  // })
  // // readonly profileImge: string;
  // @ApiProperty({
  //   example: 3,
  //   description: '유저 티어 정보',
  //   required: true,
  // })
  // @Expose()
  // readonly tier: number;
}
