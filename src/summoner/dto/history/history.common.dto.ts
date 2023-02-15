import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { CommonEntity } from '../../../common/entities/common.entity';

export class SummonerHistoryCommonDTO extends CommonEntity {
  @ApiProperty({
    example: 5,
    description: '소환사 승 수',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  win: boolean;

  @ApiProperty({
    example: '5',
    description: '소환사 킬 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  kill: number;

  @ApiProperty({
    example: '5',
    description: '소환사 데스',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  death: number;

  @ApiProperty({
    example: '5',
    description: '소환사 어시스트',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  assist: number;

  @ApiProperty({
    example: '0/1/2/3/4/5',
    description: '소환사 포지션',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  position: number;

  @ApiProperty({
    example: '86',
    description: '소환사 플레이 챔피언 id',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  champId: number;

  @ApiProperty({
    example: '할배탈',
    description: '소환사 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerName: SummonerEntity;

  @ApiProperty({
    example: 'uuid',
    description: '소환사 uuid',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerId: string;

  @ApiProperty({
    example: 'KR_00000',
    description: '소환사 matchId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  matchId: string;
}
