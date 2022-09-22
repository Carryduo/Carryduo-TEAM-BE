import { SummonerEntity } from './../../summoner/entities/summoner.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { CommentEntity } from '../entities/comments.entity';
import { UserBasicInfoResponseDTO } from 'src/user/dto/user.response.dto';

export class CommentGetResponseDTO extends PickType(CommentEntity, [
  'id',
  'category',
  'content',
  'reportNum',
  'createdAt',
]) {
  @ApiProperty({
    description: '평판 작성자 정보',
  })
  userId: UserBasicInfoResponseDTO;
  @ApiProperty({
    example: 1,
    description: '평판이 등록된 챔피언 고유 ID',
  })
  champId: ChampEntity['id'];

  @ApiProperty({
    example: 'sdfdsxv1235pqwcm',
    description: '평판이 등록된 소환사 고유 ID',
  })
  SummonerId: SummonerEntity['id'];
}
