import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { UserBasicInfoResponseDTO } from 'src/user/dto/user.response.dto';
import { Repository, Equal } from 'typeorm';
import { PostCommentDTO } from './dto/comment.request.dto';
import { CommentEntity } from './entities/comments.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}
  //   TODO: 코드 사용성 개선 (쿼리가 불필요하게 많음)

  // : Promise<UserBasicInfoResponseDTO[]>
  async getComments(category: string, target: string) {
    let data;
    if (category === 'champ') {
      data = await this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.userId', 'user')
        .leftJoinAndSelect('comment.champId', 'champ')
        .leftJoinAndSelect('comment.summonerId', 'summoner')
        .select([
          'comment.content',
          'comment.id',
          'user.id',
          'user.profileImg',
          'user.nickname',
          'champ.id',
          'comment.reportNum',
          'comment.createdAt',
          'comment.category',
          'comment.summonerId',
          'summoner.id',
        ])
        .where('comment.category = :category', { category })
        .andWhere('comment.champId = :champId', { champId: target })
        .orderBy({
          'comment.createdAt': 'DESC',
        })
        .getMany();
    } else if (category === 'summoner') {
      console.log(category, target);
      data = await this.commentsRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.userId', 'user')
        .leftJoinAndSelect('comment.champId', 'champ')
        .leftJoinAndSelect('comment.summonerId', 'summoner')
        .select([
          'comment.content',
          'comment.id',
          'user.id',
          'user.profileImg',
          'user.nickname',
          'champ.id',
          'comment.reportNum',
          'comment.createdAt',
          'comment.category',
          'comment.summonerId',
          'summoner.id',
        ])
        .where('comment.category = :category', { category })
        // .andWhere('comment.summonerId = :summonerId', { summonerId: target })
        .orderBy({
          'comment.createdAt': 'DESC',
        })
        .getMany();
    }
    console.log(data);
    return data;
  }
  async postComment(
    category: string,
    target: string,
    user: AdminResponseDTO,
    data: PostCommentDTO,
  ) {
    // 챔피언 댓글
    if (category === 'champ') {
      await this.commentsRepository
        .createQueryBuilder()
        .insert()
        .into(CommentEntity)
        .values({
          userId: user.userId,
          category,
          champId: target,
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
          userId: user.userId,
          category,
          summonerId: target,
          content: data.content,
        })
        .execute();
    }
    return { success: true, message: '평판 업로드 완료했습니다' };
  }

  // TODO: 조회 + 생성 트랜젝션 연결하기
  async updateReportNum(id, userId) {
    return await this.commentsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const data = await transactionalEntityManager
          .createQueryBuilder()
          .select('COMMENT')
          .from(CommentEntity, 'COMMENT')
          .where('COMMENT.id = :id', { id })
          .andWhere('COMMENT.userId = :userId', { userId })
          .getOne();
        await transactionalEntityManager
          .createQueryBuilder()
          .update(CommentEntity)
          .set({ reportNum: data.reportNum + 1 })
          .where('id = :id', { id })
          .andWhere('userId = :userId', { userId })
          .execute();
      },
    );
  }
  // TODO: 없는 COMMENT의 경우에는 없는 평판이라고 메시지 줘야함.
  async deleteComment(id, userId) {
    return await this.commentsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const data = await transactionalEntityManager
          .createQueryBuilder()
          .select('COMMENT')
          .from(CommentEntity, 'COMMENT')
          .where('COMMENT.id = :id', { id })
          .andWhere('COMMENT.userId = :userId', { userId })
          .getOne();
        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(CommentEntity)
          .where('id = :id', { id: data.id })
          .andWhere('userId = :userId', { userId })
          .execute();
      },
    );
  }

  async updateContent(id: string, userId: string, content: string) {
    return await this.commentsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const data = await transactionalEntityManager
          .createQueryBuilder()
          .select('COMMENT')
          .from(CommentEntity, 'COMMENT')
          .where('COMMENT.id = :id', { id })
          .andWhere('COMMENT.userId = :userId', { userId })
          .getOne();
        await transactionalEntityManager
          .createQueryBuilder()
          .update(CommentEntity)
          .set({ content })
          .where('id = :id', { id: data.id })
          .andWhere('userId = :userId', { userId })
          .execute();
      },
    );
  }
}
