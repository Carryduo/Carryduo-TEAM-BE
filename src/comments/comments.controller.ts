import { Controller, UseFilters, Get, Post, Param, Req, Body, UseGuards, Delete, Patch, ParseUUIDPipe, HttpException, UseInterceptors, CacheInterceptor } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from 'src/admin/dto/admin.response.dto';
import { HttpCacheInterceptor } from 'src/common/interceptors/cache.interceptor';
import { jwtGuard } from '../admin/jwt/jwt.guard';
import { User } from '../common/decorators/user.decorator';
import { CommonResponseDto } from '../common/dto/common.response.dto';
import { HttpExceptionFilter } from '../common/exception/http-exception.filter';
import { CommentsService } from './comments.service';
import { CommentParamDto, CommentBodyDto } from './dto/comment.request.dto';
import { CommentGetResponseDto } from './dto/comment.response.dto';
import { CommentParamPipe } from './pipes/comment.param.validation.pipe';

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
    type: CommentGetResponseDto,
  })
  // @UseInterceptors(HttpCacheInterceptor)
  @Get('/:category/:target')
  getComments(@Param(CommentParamPipe) param: CommentParamDto): Promise<CommentGetResponseDto[]> {
    return this.commentService.getComments(param.toGetCommentRequestDto());
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
    type: CommonResponseDto,
  })
  @Post('/:category/:target')
  @UseGuards(jwtGuard)
  async postComment(@Param(CommentParamPipe) param: CommentParamDto, @User() user: LoginResponseDto, @Body() body: CommentBodyDto) {
    await this.commentService.postComment(user.toPostCommentRequestDto(param.category, param.target, body.content));
    return new CommonResponseDto(true, '평판 업로드 완료했습니다');
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
    type: CommonResponseDto,
  })
  @Patch('/:id')
  @UseGuards(jwtGuard)
  async updateContent(@Param('id', ParseUUIDPipe) id, @User() user: LoginResponseDto, @Body() body: CommentBodyDto) {
    await this.commentService.updateContent(user.toUpdateCommentRequestDto(id, body.content));
    return new CommonResponseDto(true, '평판 수정 완료되었습니다');
  }

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
    type: CommonResponseDto,
  })
  @Patch('/report/:id')
  @UseGuards(jwtGuard)
  async updateReportNum(@Param('id', ParseUUIDPipe) commentId: string, @User() user: LoginResponseDto): Promise<CommonResponseDto> {
    await this.commentService.updateReportNum(user.toUpdateCommentReportNumRequestDto(commentId));
    return new CommonResponseDto(true, '평판 신고 완료되었습니다');
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
    type: CommonResponseDto,
  })
  @Delete('/:id')
  @UseGuards(jwtGuard)
  async deleteComment(@Param('id', ParseUUIDPipe) commentId: string, @User() user: LoginResponseDto): Promise<CommonResponseDto> {
    await this.commentService.deleteComment(user.toDeleteCommentRequestDto(commentId));
    return new CommonResponseDto(true, '평판 삭제 완료되었습니다');
  }
}
