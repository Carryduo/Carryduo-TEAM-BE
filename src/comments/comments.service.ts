import { CommentRepository } from './comments.repository';
import { CommentParamDTO, PostCommentDTO } from './dto/comment.request.dto';
import { Injectable } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  getComments(data: CommentParamDTO) {
    return this.commentRepository.getComments(data);
  }

  postComment(
    param: CommentParamDTO,
    user: AdminResponseDTO,
    data: PostCommentDTO,
  ) {
    return this.commentRepository.postComment(param, user, data);
  }

  updateReportNum(param) {
    return this.commentRepository.updateReportNum(param);
  }

  deleteComment(param) {
    return this.commentRepository.deleteComment(param);
  }
}
