import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { CommentEntity } from '../entities/comments.entity';

export class CommentParamDTO {
  @IsNotEmpty()
  category: 'summoner' | 'champ';

  @IsNotEmpty()
  target: SummonerEntity['id'] | ChampEntity['id'];
}

export class PostCommentDTO extends PickType(CommentEntity, ['content']) {}
