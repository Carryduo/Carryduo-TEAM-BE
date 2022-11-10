import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { ChampCommonDTO } from 'src/champ/dto/champ/champ.common.dto';
import { SummonerCommonDTO } from 'src/summoner/dto/summoner/summoner.common.dto';
import { UserCommonDto } from 'src/user/dto/user.common.dto';
import { UserBasicInfoResponseDTO } from 'src/user/dto/user.response.dto';
import { CommentCommonDto } from './comments.common.dto';

export class CommentGetResponseDTO extends PickType(CommentCommonDto, [
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

class CommentUser extends OmitType(UserCommonDto, [
  'createdAt',
  'updatedAt',
  'deletedAt',
  'preferChamp1',
  'preferChamp2',
  'preferChamp3',
]) {}

class CommentSummoner extends OmitType(SummonerCommonDTO, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'mostChamp1',
  'mostChamp2',
  'mostChamp3',
]) {}

export class ContentDTO extends PickType(CommentCommonDto, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'category',
  'content',
  'reportNum',
]) {
  userId: CommentUser;
  champId: ChampCommonDTO | null;
  summonerName: CommentSummoner;
}
