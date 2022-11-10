import { ApiProperty } from '@nestjs/swagger';
import { UserBasicInfoResponseDTO } from 'src/user/dto/user.response.dto';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ChampCommonDTO } from 'src/champ/dto/champ/champ.common.dto';

export class CommentCommonDto {
  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '평판 고유 ID',
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
    example: 'summoner/champ',
    description: '평판글의 소속 카테고리(소환사에 대한/챔피언에 대한)',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: '짱입니다',
    description: '평판글 내용',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '2',
    description: '신고 받은 횟수',
    required: false,
  })
  @IsNumber()
  @IsNotEmpty()
  reportNum: number;

  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '글 작성자 ID',
    required: false,
  })
  userId: UserBasicInfoResponseDTO | string;

  @ApiProperty({
    example: '56',
    description: '챔피언 ID',
    required: false,
  })
  champId: ChampCommonDTO | string;

  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '소환사 이름',
    required: false,
  })
  summonerName: { summonerName: string } | string;
}
