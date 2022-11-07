import { ApiProperty, PickType } from '@nestjs/swagger';
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

export class UpdateContentDTO extends PickType(CommentCommonDto, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'category',
  'content',
  'reportNum',
]) {
  userId: UserCommonDto['userId'];
  socialId: UserCommonDto['socialId'];
  social: UserCommonDto['social'];
  nickname: UserCommonDto['nickname'];
  profileImg: UserCommonDto['profileImg'];
  bio: UserCommonDto['bio'];
  preferPosition: UserCommonDto['preferPosition'];
  tier: UserCommonDto['tier'];
  enableChat: [UserCommonDto['enableChat']];
  champId: string | null;
  summonerName: {
    summonerName: SummonerCommonDTO['summonerName'];
    summonerId: SummonerCommonDTO['summonerId'];
    summonerIcon: SummonerCommonDTO['summonerIcon'];
    summonerLevel: SummonerCommonDTO['summonerLevel'];
    tier: SummonerCommonDTO['tier'];
    tierImg: SummonerCommonDTO['tierImg'];
    lp: SummonerCommonDTO['lp'];
    win: SummonerCommonDTO['win'];
    lose: SummonerCommonDTO['lose'];
    winRate: SummonerCommonDTO['winRate'];
  };
}
