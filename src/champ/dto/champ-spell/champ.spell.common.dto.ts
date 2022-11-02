import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChampSpellCommonDTO {
  @ApiProperty({
    example: '1',
    description: 'spell Id',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  spell1: number;

  @ApiProperty({
    example: '2',
    description: 'spell Id',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  spell2: number;

  @ApiProperty({
    example: '50.0',
    description: 'spell1, spell2 의 픽률',
    required: true,
  })
  @IsDecimal()
  @IsNotEmpty()
  pickRate: number;

  @ApiProperty({
    example: '50',
    description: '표본 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  sampleNum: number;

  @ApiProperty({
    example: '12.20',
    description: '게임 버전',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  version: string;
}
