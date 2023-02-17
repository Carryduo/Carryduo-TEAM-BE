import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampCommonDTO } from '../../champ/dto/champ/champ.common.dto';
import { SummonerCommonDTO } from '../../summoner/dto/summoner/summoner.common.dto';
import { UserCommonDto } from '../../user/dto/user.common.dto';
import { UserBasicInfoResponseDTO } from '../../user/dto/user.response.dto';
import { CommentEntity } from '../entities/comments.entity';
import { CommentCommonDto } from './comments.common.dto';

export class CommentGetResponseDto {
  @Exclude() _id: string;
  @Exclude() _createdAt: Date;
  @Exclude() _category: string;
  @Exclude() _content: string;
  @Exclude() _reportNum: number;
  @Exclude() _userId: UserEntity;
  @Exclude() _champId?: ChampEntity;
  @Exclude() _summonerName?: SummonerEntity;

  constructor(data: CommentEntity) {
    this._id = data.id;
    this._createdAt = data.createdAt;
    this._category = data.category;
    this._content = data.content;
    this._reportNum = data.reportNum;
    this._userId = data.userId;
    this._champId = data.champId;
    this._summonerName = data.summonerName;
  }

  @ApiProperty({
    example: 'dqwdsafgq3wwe',
    description: '평판 고유 ID',
    required: true,
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    example: '2022-09-17',
    description: '생성 날짜',
  })
  @Expose()
  get createdAt() {
    return this._createdAt;
  }

  @ApiProperty({
    example: 'summoner/champ',
    description: '평판글의 소속 카테고리(소환사에 대한/챔피언에 대한)',
    required: false,
  })
  @Expose()
  get category() {
    return this._category;
  }

  @ApiProperty({
    example: '짱입니다',
    description: '평판글 내용',
    required: false,
  })
  @Expose()
  get content() {
    return this._content;
  }

  @ApiProperty({
    example: '2',
    description: '신고 받은 횟수',
    required: false,
  })
  @Expose()
  get reportNum() {
    return this._reportNum;
  }

  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '글 작성자 ID',
    required: false,
  })
  @Expose()
  get userId() {
    return this._userId;
  }

  @ApiProperty({
    example: '56',
    description: '챔피언 ID',
    required: false,
  })
  @Expose()
  get champId() {
    return this._champId;
  }

  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '소환사 이름',
    required: false,
  })
  @Expose()
  get summonerName() {
    return this._summonerName;
  }
}
export class CommentGetResponseDTO extends PickType(CommentCommonDto, ['id', 'category', 'content', 'reportNum', 'createdAt']) {
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

class CommentUser extends OmitType(UserCommonDto, ['createdAt', 'updatedAt', 'deletedAt', 'preferChamp1', 'preferChamp2', 'preferChamp3']) {}

class CommentSummoner extends OmitType(SummonerCommonDTO, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'mostChamp1', 'mostChamp2', 'mostChamp3']) {}

export class ContentDTO extends PickType(CommentCommonDto, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'category', 'content', 'reportNum']) {
  userId: CommentUser;
  champId: ChampCommonDTO | null;
  summonerName: CommentSummoner;
}
