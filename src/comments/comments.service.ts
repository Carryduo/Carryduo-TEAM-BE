import { CommentRepository } from './comments.repository';
import { PostCommentDTO } from './dto/comment.request.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { stringify } from 'querystring';
import { CommentGetResponseDTO } from './dto/comment.response.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getComments(
    category: string,
    target: string,
  ): Promise<CommentGetResponseDTO> {
    return await this.commentRepository.getComments(category, target);
  }

  postComment(
    category: string,
    target: string,
    user: AdminResponseDTO,
    data: PostCommentDTO,
  ) {
    return this.commentRepository.postComment(category, target, user, data);
  }

  async updateReportNum(id: string, userId: string) {
    try {
      await this.commentRepository.updateReportNum(id, userId);
      return {
        message: '평판 신고 완료되었습니다',
        success: true,
      };
    } catch {
      throw new HttpException('평판 신고 실패하였습니다', 400);
    }
  }

  async deleteComment(id: string, userId: string) {
    try {
      const data = await this.commentRepository.deleteComment(id, userId);
      console.log(data);
      return {
        success: true,
        message: '평판 삭제 완료되었습니다',
      };
    } catch {
      throw new HttpException('평판 삭제 실패하였습니다', 400);
    }
  }

  async updateContent(id: string, userId: string, content: string) {
    try {
      await this.commentRepository.updateContent(id, userId, content);
      return {
        success: true,
        message: '평판 수정 완료되었습니다',
      };
    } catch {
      throw new HttpException('평판 수정 실패하였습니다', 400);
    }
  }
}
