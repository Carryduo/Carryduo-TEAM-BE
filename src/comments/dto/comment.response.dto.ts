import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { SummonerEntity } from '../../summoner/entities/summoner.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { CommentEntity } from '../entities/comments.entity';

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
