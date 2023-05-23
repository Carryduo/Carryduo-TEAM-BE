import { UserEntity } from './../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { SummonerEntity } from '../../summoner/entities/summoner.entity';
import { CommentEntity } from '../entities/comments.entity';

export class CommentParamDto {
  @IsNotEmpty()
  @IsString()
  category: 'summoner' | 'champ';

  @IsNotEmpty()
  @IsString()
  target: string;

  toGetCommentRequestDto() {
    return GetCommentRequestDto.createDto(this.category, this.target);
  }
}

export class CommentBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '댓글 예시입니다',
    description: '댓글 내용',
    required: true,
  })
  content: string;
}

export class GetCommentRequestDto {
  @Exclude() _category: 'champ' | 'summoner';
  @Exclude() _target: string;

  constructor(category: 'champ' | 'summoner', target: string) {
    this._target = target;
    this._category = category;
  }

  get category() {
    return this._category;
  }

  get target() {
    return this._target;
  }

  static createDto(category: 'summoner' | 'champ', target: string) {
    return new GetCommentRequestDto(category, target);
  }
  toEntity() {
    let target: ChampEntity | SummonerEntity;
    if (this._category === 'champ') {
      target = ChampEntity.createChampIdOption(this._target);
      return CommentEntity.createGetChampComentOption(this._category, target);
    } else {
      target = SummonerEntity.createSummonerNameOption(this._target);
      return CommentEntity.createGetSummonerCommentOption(
        this._category,
        target,
      );
    }
  }
}

export class PostCommentRequestDto {
  @Exclude() private readonly _userId: string;
  @Exclude() private readonly _category: 'summoner' | 'champ';
  @Exclude() private readonly _target: string;
  @Exclude() private readonly _content: string;

  constructor(
    userId: string,
    category: 'summoner' | 'champ',
    target: string,
    content: string,
  ) {
    this._userId = userId;
    this._category = category;
    this._target = target;
    this._content = content;
  }

  static createDto(
    userId: string,
    category: 'summoner' | 'champ',
    target: string,
    content: string,
  ) {
    return new PostCommentRequestDto(userId, category, target, content);
  }

  @Expose()
  get category() {
    return this._category;
  }

  @Expose()
  get target() {
    return this._target;
  }

  toEntity(): CommentEntity {
    // USERENTITY로 치환하는 거 하나
    let target: ChampEntity | SummonerEntity;
    const userId = UserEntity.createSelectOption(this._userId);
    if (this._category === 'champ') {
      target = ChampEntity.createChampIdOption(this._target);
      return CommentEntity.createPostChampCommentOption(
        this._category,
        target,
        this._content,
        userId,
      );
    } else {
      target = SummonerEntity.createSummonerNameOption(this._target);
      return CommentEntity.createPostSummonerCommentOption(
        this._category,
        target,
        this._content,
        userId,
      );
    }
    return;
  }
}

export class UpdateCommentRequestDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _userId: string;
  @Exclude() private readonly _content: string;

  constructor(id: string, userId: string, content: string) {
    this._id = id;
    this._userId = userId;
    this._content = content;
  }

  static createDto(id: string, userId: string, content: string) {
    return new UpdateCommentRequestDto(id, userId, content);
  }

  toEntity(): CommentEntity {
    const userId = UserEntity.createSelectOption(this._userId);
    return CommentEntity.createUpdateCommentOption(
      this._id,
      userId,
      this._content,
    );
  }
}

export class UpdateReportNumRequestDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _userId: string;

  constructor(id: string) {
    this._id = id;
  }

  static createDto(id: string) {
    return new UpdateReportNumRequestDto(id);
  }

  toEntity(): CommentEntity {
    return CommentEntity.createUpdateReportNumOption(this._id);
  }
}

export class DeleteCommentRequestDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _userId: string;

  constructor(id: string, userId: string) {
    this._id = id;
    this._userId = userId;
  }

  static createDto(id: string, userId: string) {
    return new DeleteCommentRequestDto(id, userId);
  }

  toEntity(): CommentEntity {
    const userId = UserEntity.createSelectOption(this._userId);
    return CommentEntity.createDeleteCommentOption(this._id, userId);
  }
}
