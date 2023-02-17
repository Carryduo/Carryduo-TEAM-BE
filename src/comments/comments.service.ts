import { CommentRepository } from './comments.repository';
import { DeleteCommentRequestDto, GetCommentRequestDto, PostCommentRequestDto, UpdateCommentRequestDto, UpdateReportNumRequestDto } from './dto/comment.request.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { CommentGetResponseDto } from './dto/comment.response.dto';
import { Brackets } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getComments(requestOption: GetCommentRequestDto): Promise<CommentGetResponseDto[]> {
    try {
      const whereOption = this.commentRepository.createSelectOption(requestOption.toEntity());
      const data = await this.commentRepository.getComments(whereOption);
      return data.map((value) => {
        return new CommentGetResponseDto(value);
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('평판 조회 실패하였습니다', 400);
    }
  }

  async postComment(requestOption: PostCommentRequestDto) {
    try {
      const whereOption = this.commentRepository.createSelectOption(requestOption.toEntity());
      await this.commentRepository.postComment(requestOption.toEntity());
      await this.commentRepository.setCommentCache(requestOption.category, requestOption.target, whereOption);
      return;
    } catch (err) {
      console.log(err);
      throw new HttpException('평판 등록 실패하였습니다', 400);
    }
  }

  async updateContent(requestOption: UpdateCommentRequestDto) {
    try {
      const data = await this.commentRepository.updateContent(requestOption.toEntity());
      const category = data.category;
      let target: string;
      // TODO: 테스트코드 반영
      if (data.champId) {
        target = data.champId.id;
      } else {
        target = data.summonerName.summonerName;
      }
      const whereOption = this.commentRepository.createSelectOption(data);
      await this.commentRepository.setCommentCache(category, target, whereOption);
      return;
    } catch (err) {
      console.error(err);
      throw new HttpException('평판 수정 실패하였습니다', 400);
    }
  }

  async updateReportNum(requestOption: UpdateReportNumRequestDto) {
    try {
      const data = await this.commentRepository.updateReportNum(requestOption.toEntity());
      const category = data.category;
      let target: string;
      // TODO: 테스트코드 반영
      if (data.champId) {
        target = data.champId.id;
      } else {
        target = data.summonerName.summonerName;
      }
      const whereOption = this.commentRepository.createSelectOption(data);
      await this.commentRepository.setCommentCache(category, target, whereOption);
      return;
    } catch (error) {
      throw new HttpException('평판 신고 실패하였습니다', 400);
    }
  }

  async deleteComment(requestOption: DeleteCommentRequestDto) {
    try {
      const data = await this.commentRepository.deleteComment(requestOption.toEntity());
      const category = data.category;
      let target: string;
      // TODO: 테스트코드 반영
      if (data.champId) {
        target = data.champId.id;
      } else {
        target = data.summonerName.summonerName;
      }
      const whereOption = this.commentRepository.createSelectOption(data);
      await this.commentRepository.setCommentCache(category, target, whereOption);
      return;
    } catch (error) {
      throw new HttpException('평판 삭제 실패하였습니다', 400);
    }
  }
}
