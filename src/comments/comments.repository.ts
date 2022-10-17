import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comments.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}
  //   TODO: 코드 사용성 개선 (쿼리가 불필요하게 많음)

  // : Promise<UserBasicInfoResponseDTO[]>
  async getComments(option) {
    return await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
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
        'comment.summonerName',
        'summoner.summonerName',
      ])
      .where(option)
      .orderBy({
        'comment.createdAt': 'DESC',
      })
      .getMany();
  }
  // TODO: QUERY 분기점 service로 옮기기
  async postComment(value, option) {
    const { target, category } = option;
    // 챔피언 댓글
    await this.commentsRepository
      .createQueryBuilder()
      .insert()
      .into(CommentEntity)
      .values(value)
      .execute();

    const result = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
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
        'comment.summonerName',
        'summoner.summonerName',
      ])
      .where(option)
      .orderBy({
        'comment.createdAt': 'DESC',
      })
      .getMany();

    return { success: true, message: '평판 업로드 완료했습니다' };
  }

  // TODO: 조회 + 생성 트랜젝션 연결하기
  async updateReportNum(id) {
    return await this.commentsRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const data = await transactionalEntityManager
          .createQueryBuilder()
          .select('COMMENT')
          .from(CommentEntity, 'COMMENT')
          .where('COMMENT.id = :id', { id })
          .getOne();
        await transactionalEntityManager
          .createQueryBuilder()
          .update(CommentEntity)
          .set({ reportNum: data.reportNum + 1 })
          .where('id = :id', { id })
          .execute();
      },
    );
  }
  // TODO: 없는 COMMENT의 경우에는 없는 평판이라고 메시지 줘야함.
  async deleteComment(id: string, userId: string) {
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
