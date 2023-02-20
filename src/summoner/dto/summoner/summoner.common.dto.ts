import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { ChampCommonDTO } from '../../../champ/dto/champ/champ.common.dto';
import { CommonEntity } from '../../../common/entities/common.entity';

export class SummonerCommonDTO extends CommonEntity {
  @ApiProperty({
    example: '할배탈',
    description: '소환사 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerName: string;

  @ApiProperty({
    example: 'uuid',
    description: '소환사 id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerId: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 아이콘',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerIcon: string;

  @ApiProperty({
    example: '120',
    description: '소환사 레벨',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  summonerLevel: string;

  @ApiProperty({
    example: 'SILVER I',
    description: '소환사 티어',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tier: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 티어 이미지',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  tierImg: string;

  @ApiProperty({
    example: '98',
    description: '소환사 리그 포인트',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  lp: number;

  @ApiProperty({
    example: '75',
    description: '소환사 승리 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  win: number;

  @ApiProperty({
    example: '55',
    description: '소환사 패배 수',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  lose: number;

  @ApiProperty({
    example: '57',
    description: '소환사 승률',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  winRate: number;

  @ApiProperty({
    example: '81',
    description: '모스트 챔피언1',
    required: true,
  })
  mostChamp1: ChampCommonDTO;

  @ApiProperty({
    example: '412',
    description: '모스트 챔피언2',
    required: true,
  })
  mostChamp2: ChampCommonDTO;

  @ApiProperty({
    example: '222',
    description: '모스트 챔피언3',
    required: true,
  })
  mostChamp3: ChampCommonDTO;
}

export class SummonerDefaultDataDto {
  summonerName: string;
  summonerIcon: string;
  summonerLevel: string;
  tier: string;
  tierImg: string;
  lp: number;
  win: number;
  lose: number;
  winRate: number;
  mostChamps: ChampEntity[];

  static plainToSummonerDeafultDataDto(data: SummonerEntity) {
    const summonerData = new SummonerDefaultDataDto();
    summonerData.summonerName = data.summonerName;
    summonerData.summonerIcon = data.summonerIcon;
    summonerData.summonerLevel = data.summonerLevel;
    summonerData.tier = data.summonerLevel;
    summonerData.tierImg = data.tierImg;
    summonerData.lp = data.lp;
    summonerData.win = data.win;
    summonerData.lose = data.lose;
    summonerData.winRate = data.winRate;
    summonerData.mostChamps = [
      data.mostChamp1,
      data.mostChamp2,
      data.mostChamp3,
    ];
    return summonerData;
  }
}
