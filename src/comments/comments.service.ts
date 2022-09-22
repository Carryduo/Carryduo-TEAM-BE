import { CommentRepository } from './comments.repository';
import { PostCommentDTO } from './dto/comment.request.dto';
import { Injectable } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { stringify } from 'querystring';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  getComments(category: string, target: string) {
    return this.commentRepository.getComments(category, target);
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
    let message, success;
    try {
      await this.commentRepository.updateReportNum(id, userId);
      message = '평판 신고 완료되었습니다';
      success = true;
    } catch {
      message = '평판 신고 실패하였습니다';
      success = false;
    } finally {
      return { success, message };
    }
  }

  async deleteComment(id: string, userId: string) {
    let success, message;
    try {
      const data = await this.commentRepository.deleteComment(id, userId);
      console.log(data);
      success = true;
      message = '평판 삭제 완료되었습니다';
    } catch {
      success = false;
      message = '평판 삭제 실패하였습니다';
    } finally {
      return { success, message };
    }
  }

  async updateContent(id: string, userId: string, content: string) {
    let success, message;
    try {
      await this.commentRepository.updateContent(id, userId, content);
      success = true;
      message = '평판 수정 완료되었습니다';
    } catch {
      success = false;
      message = '평판 수정 실패하였습니다';
    } finally {
      return { success, message };
    }
  }
}
