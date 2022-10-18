import {
  Controller,
  UseFilters,
  Get,
  Post,
  Param,
  Req,
  Body,
  UseGuards,
  Delete,
  Patch,
  ParseUUIDPipe,
  HttpException,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/admin/jwt/jwt.guard';
import { CommonResponseDTO } from 'src/common/dto/common.response.dto';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { CommentsService } from './comments.service';
import { PostCommentDTO } from './dto/comment.request.dto';
import { CommentGetResponseDTO } from './dto/comment.response.dto';
import { CommentCategoryPipe } from './pipes/comment.param.validation.pipe';

@Controller('comments')
@ApiTags('comment')
@UseFilters(HttpExceptionFilter)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @ApiOperation({ summary: '평판 조회' })
  @ApiParam({
    name: 'category',
    required: true,
    description: '챔피언 평판/소환사 평판 분류 기준',
    example: 'summoner/champ',
  })
  @ApiParam({
    name: 'target',
    required: true,
    description: '특정 챔피언/소환사 등 평판글의 대상',
    example: 'UUID/number',
  })
  @ApiResponse({
    status: 200,
    description: '평판 조회 응답 예시',
    type: CommentGetResponseDTO,
  })
  @UseInterceptors(CacheInterceptor)
  @Get('/:category/:target')
  getComments(
    @Param('category', CommentCategoryPipe) category: string,
    @Param('target') target: string,
  ) {
    console.log('no cache here');
    if (isNaN(Number(target))) {
      if (category === 'champ') {
        throw new HttpException(`${target}은 챔피언 평판 타겟이 아닙니다`, 400);
      }
    } else if (category === 'summoner') {
      throw new HttpException(`${target}은 소환사 평판 타겟이 아닙니다`, 400);
    }

    return this.commentService.getComments(category, target);
  }

  @ApiOperation({ summary: '평판 등록' })
  @ApiParam({
    name: 'category',
    required: true,
    description: '챔피언 평판/소환사 평판 분류 기준',
    example: 'summoner/champ',
  })
  @ApiParam({
    name: 'target',
    required: true,
    description: '특정 챔피언/소환사 등 평판글의 대상',
    example: 'UUID/number',
  })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '평판 등록 성공',
    type: CommonResponseDTO,
  })
  @Post('/:category/:target')
  @UseGuards(jwtGuard)
  postComment(
    @Param('category', CommentCategoryPipe) category: string,
    @Param('target') target: string,
    @Req() req,
    @Body() body: PostCommentDTO,
  ) {
    if (isNaN(Number(target))) {
      if (category === 'champ') {
        throw new HttpException(`${target}은 챔피언 평판 타겟이 아닙니다`, 400);
      }
    } else if (category === 'summoner') {
      throw new HttpException(`${target}은 소환사 평판 타겟이 아닙니다`, 400);
    }
    return this.commentService.postComment(category, target, req.user, body);
  }

  // TODO: id validator 필요

  @ApiOperation({ summary: '평판 신고' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '평판 고유 ID',
  })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '평판 신고 성공',
    type: CommonResponseDTO,
  })
  @Patch('/report/:id')
  @UseGuards(jwtGuard)
  updateReportNum(@Param('id', ParseUUIDPipe) id) {
    return this.commentService.updateReportNum(id);
  }

  @ApiOperation({ summary: '평판 수정' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '평판 고유 ID',
  })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '평판 수정 성공',
    type: CommonResponseDTO,
  })
  @Patch('/:id')
  @UseGuards(jwtGuard)
  updateContent(
    @Param('id', ParseUUIDPipe) id,
    @Req() req,
    @Body() body: PostCommentDTO,
  ) {
    const userId = req.user.userId;
    return this.commentService.updateContent(id, userId, body.content);
  }

  @ApiOperation({ summary: '평판 삭제' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '평판 고유 ID',
  })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '평판 삭제 성공',
    type: CommonResponseDTO,
  })
  @Delete('/:id')
  @UseGuards(jwtGuard)
  deleteComment(@Param('id', ParseUUIDPipe) id, @Req() req) {
    const userId = req.user.userId;
    return this.commentService.deleteComment(id, userId);
  }
}
