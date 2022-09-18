import { IsNotEmpty, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';

export class CommentParamDTO {
  @IsNotEmpty()
  category: 'summoner' | 'champ';

  @IsNotEmpty()
  target: SummonerEntity['id'] | ChampEntity['id'];
}

export class PostCommentDTO {
  @IsString()
  @IsNotEmpty()
  content: string;
}
