import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { UserBasicInfoResponseDTO } from 'src/user/dto/user.response.dto';
import { Repository, Equal } from 'typeorm';
import { CommentParamDTO, PostCommentDTO } from './dto/comment.request.dto';
import { CommentEntity } from './entities/comments.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}
  //   TODO: 코드 사용성 개선

  async getComments(
    param: CommentParamDTO,
  ): Promise<UserBasicInfoResponseDTO[]> {
    if (param.category === 'champ') {
      const result = [];
      const data = await this.commentsRepository.find({
        where: { category: param.category, champId: Equal(param.target) },
      });
      data.map((value) => {
        result.push({
          id: value.id,
          category: value.category,
          content: value.category,
          reportNum: value.reportNum,
          userId: {
            id: value.userId.id,
            nickname: value.userId.nickname,
            profileImg: value.userId.profileImg,
            enableChat: value.userId.enableChat,
          },
          champId: value.champId.id,
        });
      });
      //   const user = await result.userId;
      return result;
    } else if (param.category === 'summoner') {
      const result = [];
      const data = await this.commentsRepository.find({
        where: { category: param.category, summonerId: Equal(param.target) },
      });
      data.map((value) => {
        result.push({
          id: value.id,
          category: value.category,
          content: value.category,
          reportNum: value.reportNum,
          userId: {
            id: value.userId.id,
            nickname: value.userId.nickname,
            profileImg: value.userId.profileImg,
            enableChat: value.userId.enableChat,
          },
          summonerId: value.summonerId.id,
        });
      });
      return result;
    }
  }
  async postComment(
    param: CommentParamDTO,
    user: AdminResponseDTO,
    data: PostCommentDTO,
  ) {
    const { category, target } = param;
    // 챔피언 댓글
    if (category === 'champ') {
      await this.commentsRepository
        .createQueryBuilder()
        .insert()
        .into(CommentEntity)
        .values({
          userId: { id: user.userId },
          category,
          champId: { id: target },
          content: data.content,
        })
        .execute();
    }
    // 소환사 댓글
    else if (category === 'summoner') {
      await this.commentsRepository
        .createQueryBuilder()
        .insert()
        .into(CommentEntity)
        .values({
          // Promise로 묶인 column은 다음과 같이 function 형태로 주입해주어야 한다.
          userId: { id: user.userId },
          category,
          summonerId: { id: target },
          content: data.content,
        })
        .execute();
    }
    return { success: true, message: '평판 업로드 완료했습니다' };
  }

  // TODO: 조회 + 생성 트랜젝션 연결하기
  async updateReportNum(param) {
    const reportNum =
      (
        await this.commentsRepository.findOne({
          where: { id: param.id },
        })
      ).reportNum + 1;
    await this.commentsRepository
      .createQueryBuilder()
      .update(CommentEntity)
      .set({ reportNum })
      .where('id = :id', { id: param.id })
      .execute();
    return { success: true, message: '평판 신고 완료되었습니다' };
  }
  // TODO: 없는 COMMENT의 경우에는 없는 평판이라고 메시지 줘야함.
  async deleteComment(param) {
    this.commentsRepository
      .createQueryBuilder()
      .delete()
      .from(CommentEntity)
      .where('id = :id', { id: param.id })
      .execute();
    return { success: true, message: '평판 삭제 완료되었습니다' };
  }
}
