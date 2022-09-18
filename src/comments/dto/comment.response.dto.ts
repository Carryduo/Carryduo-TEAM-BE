import { SummonerEntity } from './../../summoner/entities/summoner.entity';
import { PickType } from '@nestjs/swagger';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { CommentEntity } from '../entities/comments.entity';
import { UserBasicInfoResponseDTO } from 'src/user/dto/user.response.dto';

export class CommentResponseDTO extends PickType(CommentEntity, [
  'id',
  'category',
  'content',
  'reportNum',
]) {
  userId: UserBasicInfoResponseDTO;
  champId: ChampEntity['id'];
  SummonerId: SummonerEntity['id'];
}
