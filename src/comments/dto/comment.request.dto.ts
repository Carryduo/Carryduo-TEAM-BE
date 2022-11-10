import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';

export class CommentParamDTO {
  @IsNotEmpty()
  category: 'summoner' | 'champ';

  @IsNotEmpty()
  target: SummonerEntity['summonerName'] | ChampEntity['id'];
}

export class PostCommentDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '댓글 예시입니다',
    description: '댓글 내용',
    required: true,
  })
  content: string;
}
