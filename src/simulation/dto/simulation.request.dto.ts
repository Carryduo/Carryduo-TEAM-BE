import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class simulationBodyDto {
  @ApiProperty({
    example: 56,
    description: '팀A champ1의 고유 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  champ1Id: number;

  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '팀A champ2의 고유 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  champ2Id: number;

  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '팀B champ1의 고유 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  champ3Id: number;

  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '팀B champ2의 고유 ID',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  champ4Id: number;
}
