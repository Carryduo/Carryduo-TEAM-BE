import {
  UpdateReportNumRequestDto,
  DeleteCommentRequestDto,
} from './../../comments/dto/comment.request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import {
  PostCommentRequestDto,
  UpdateCommentRequestDto,
} from '../../comments/dto/comment.request.dto';
import {
  GetUserInfoRequestDto,
  UpdateUserOptionRequestBodyDto,
  UpdateUserOptionRequestDto,
} from '../../user/dto/user.request.dto';

// TODO: 얘는 RESPONSE DTO

export class FirstLoginResponseDto {
  @Exclude() private readonly _id: string;
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _token: string;

  constructor(id: string, nickname: string, token?: string) {
    this._id = id;
    this._nickname = nickname;
    this._token = token;
  }

  @ApiProperty({
    example: 'rermedq2-1038123ndkw',
    description: '유저 고유ID',
  })
  @Expose()
  get id() {
    return this._id;
  }

  @ApiProperty({
    example: 'nickname',
    description: '유저 닉네임',
  })
  @Expose()
  get nickname() {
    return this._nickname;
  }

  @ApiProperty({
    example: 'rermedq2-1038123ndkw',
    description: '유저 로그인 토큰',
  })
  @Expose()
  get token() {
    return this._token;
  }
}

export class LoginResponseDto {
  @Exclude() private readonly _userId: string;
  @Exclude() private readonly _nickname: string;
  @Exclude() private readonly _profileImg: string;

  constructor(userId: string, nickname: string, profileImg: string) {
    this._userId = userId;
    this._nickname = nickname;
    this._profileImg = profileImg;
  }

  @Expose()
  get userId() {
    return this._userId;
  }

  @Expose()
  get nickname() {
    return this._nickname;
  }

  @Expose()
  get profileImg() {
    return this._profileImg;
  }

  toGetOwnInfoRequestDto(category: string) {
    return GetUserInfoRequestDto.createDto(category, this._userId);
  }

  toUpdateOptionRequestDto(body: UpdateUserOptionRequestBodyDto) {
    return UpdateUserOptionRequestDto.createDto(this._userId, body);
  }

  toPostCommentRequestDto(
    category: 'summoner' | 'champ',
    target: string,
    content: string,
  ) {
    return PostCommentRequestDto.createDto(
      this._userId,
      category,
      target,
      content,
    );
  }

  toUpdateCommentRequestDto(commentId: string, content: string) {
    return UpdateCommentRequestDto.createDto(commentId, this._userId, content);
  }

  toUpdateCommentReportNumRequestDto(commentId: string) {
    return UpdateReportNumRequestDto.createDto(commentId);
  }
  toDeleteCommentRequestDto(commentId: string) {
    return DeleteCommentRequestDto.createDto(commentId, this._userId);
  }
}
