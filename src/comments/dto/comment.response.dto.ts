import { ApiProperty, PickType } from '@nestjs/swagger';
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
    example: { id: 15 },
    description: '평판이 등록된 챔피언 고유 ID',
  })
  champId: { id: string } | null;

  @ApiProperty({
    example: {
      summonerName: '쿠바버샷추가',
    },
    description: '평판이 등록된 소환사 이름',
  })
  summonerName: { summonerName: string } | null;
}
