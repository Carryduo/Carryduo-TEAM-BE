import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChampCommonDTO {
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  @IsString()
  id: string;
  @ApiProperty({
    example: '가렌',
    description: '챔피언 한글 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champNameKo: string;

  @ApiProperty({
    example: 'Garen',
    description: '챔피언 영문 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champNameEn: string;

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 이미지 url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  champImg: string;
}
