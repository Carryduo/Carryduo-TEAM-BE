import {
  Controller,
  UseFilters,
  Get,
  Post,
  Param,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { jwtGuard } from 'src/admin/jwt/jwt.guard';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { CommentsService } from './comments.service';
import { CommentParamDTO, PostCommentDTO } from './dto/comment.request.dto';

@Controller('comments')
@ApiTags('comment')
@UseFilters(HttpExceptionFilter)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  //   TODO: category validation: summoner or champ
  @Get('/:category/:target')
  getComments(@Param() param: CommentParamDTO) {
    return this.commentService.getComments(param);
  }

  @Post('/:category/:target')
  @UseGuards(jwtGuard)
  postComment(
    @Param() param: CommentParamDTO,
    @Req() req,
    @Body() body: PostCommentDTO,
  ) {
    return this.commentService.postComment(param, req.user, body);
  }
}
