import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChampCommonDTO {
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  @IsNumber()
  id: number;

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

  @ApiProperty({
    example: '50',
    description: '챔피언 승률',
    required: true,
  })
  @IsNumber()
  winRate: number;

  @ApiProperty({
    example: '50',
    description: '챔피언 밴률',
    required: true,
  })
  @IsNumber()
  banRate: number;

  @ApiProperty({
    example: '50',
    description: '챔피언 픽률',
    required: true,
  })
  @IsNumber()
  pickRate: number;
}
