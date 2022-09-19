import { CommentRepository } from './comments.repository';
import { PostCommentDTO } from './dto/comment.request.dto';
import { Injectable } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';

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

  updateReportNum(id: string) {
    return this.commentRepository.updateReportNum(id);
  }

  deleteComment(id: string) {
    return this.commentRepository.deleteComment(id);
  }
}
