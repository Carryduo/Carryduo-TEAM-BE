import { ApiProperty } from '@nestjs/swagger';
import { ChampEntity } from 'src/champ/entities/champ.entity';

export class ChampCommonDTO {
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  readonly id: string;

  @ApiProperty({
    example: '가렌',
    description: '챔피언 한글 이름',
    required: true,
  })
  readonly champNameKo: string;

  @ApiProperty({
    example: 'Garen',
    description: '챔피언 영문 이름',
    required: true,
  })
  readonly champNameEn: string;

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 메인 이미지 url',
    required: true,
  })
  readonly champMainImg?: string;

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 이미지 url',
    required: true,
  })
  readonly champImg: string;
}
