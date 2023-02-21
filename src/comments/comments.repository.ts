import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Brackets, Repository } from 'typeorm';
import { CommentEntity } from './entities/comments.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async getComments(whereOption: Brackets): Promise<CommentEntity[]> {
    return await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .select([
        'comment.content',
        'comment.id',
        'user.userId AS userId',
        'user.profileImg',
        'user.nickname',
        'champ.id',
        'comment.reportNum',
        'comment.createdAt',
        'comment.category',
        'comment.summonerName',
        'summoner.summonerName',
      ])
      .where(whereOption)
      .orderBy({
        'comment.createdAt': 'DESC',
      })
      .getMany();
  }
  async postComment(requestOption: CommentEntity) {
    await this.commentsRepository
      .createQueryBuilder()
      .insert()
      .into(CommentEntity)
      .values(requestOption)
      .execute();
  }

  async updateReportNum(requestOption: CommentEntity) {
    await this.commentsRepository.manager.transaction(async (transactionalEntityManager) => {
      const data = await transactionalEntityManager
        .createQueryBuilder()
        .select('COMMENT')
        .from(CommentEntity, 'COMMENT')
        .where('COMMENT.id = :id', { id: requestOption.id })
        .getOne();
      await transactionalEntityManager
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ reportNum: data.reportNum + 1 })
        .where('id = :id', { id: requestOption.id })
        .execute();
    });
    const data = await this.commentsRepository
      .createQueryBuilder('comment')
      .select()
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .where('comment.id = :id', { id: requestOption.id })
      .getOne();

    return data;
  }
  async deleteComment(requestOption: CommentEntity) {
    const value = await this.commentsRepository
      .createQueryBuilder('comment')
      .select()
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .where('comment.id = :id', { id: requestOption.id })
      .getOne();
    await this.commentsRepository.manager.transaction(async (transactionalEntityManager) => {
      const data = await transactionalEntityManager
        .createQueryBuilder()
        .select('COMMENT')
        .from(CommentEntity, 'COMMENT')
        .where('COMMENT.id = :id', { id: requestOption.id })
        .andWhere('COMMENT.userId = :userId', { userId: requestOption.userId.userId })
        .getOne();
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(CommentEntity)
        .where('id = :id', { id: data.id })
        .andWhere('userId = :userId', { userId: requestOption.userId.userId })
        .execute();
    });

    return value;
  }

  async updateContent(requestOption: CommentEntity) {
    const { id, userId, content } = requestOption;

    await this.commentsRepository.manager.transaction(async (transactionalEntityManager) => {
      const data = await transactionalEntityManager
        .createQueryBuilder()
        .select('COMMENT')
        .from(CommentEntity, 'COMMENT')
        .where('COMMENT.id = :id', { id })
        .andWhere('COMMENT.userId = :userId', { userId: userId.userId })
        .getOne();
      await transactionalEntityManager
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ content })
        .where('id = :id', { id: data.id })
        .andWhere('userId = :userId', userId)
        .execute();
    });
    return await this.commentsRepository
      .createQueryBuilder('comment')
      .select()
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .where('comment.id = :id', { id })
      .getOne();
  }

  // async deleteCommentCache(category: string, target: string | number) {
  //   await this.cacheManager.del(`/commments/${category}/${target}`);
  //   return;
  // }
  async setCommentCache(category: string, target: string, whereOption: Brackets) {
    const result = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .select([
        'comment.content',
        'comment.id',
        'user.userId',
        'user.profileImg',
        'user.nickname',
        'champ.id',
        'comment.reportNum',
        'comment.createdAt',
        'comment.category',
        'comment.summonerName',
        'summoner.summonerName',
      ])
      .where(whereOption)
      .getMany();

    // 캐싱 적용
    await this.cacheManager.set(
      `/comments/${category}/${encodeURI(String(target))}`,
      JSON.stringify(result),
      { ttl: this.configService.get('REDIS_TTL') },
    );
    return;
  }

  createSelectOption(data: CommentEntity): Brackets {
    if (data.category === 'champ') {
      return new Brackets((qb) => {
        qb.where('comment.category = :category', { category: data.category }).andWhere(
          'comment.champId = :champId',
          { champId: data.champId.id },
        );
      });
    } else {
      return new Brackets((qb) => {
        qb.where('comment.category = :category', { category: data.category }).andWhere(
          'comment.summonerName = :summonerName',
          { summonerName: data.summonerName.summonerName },
        );
      });
    }
  }
}
