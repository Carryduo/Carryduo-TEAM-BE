import { Inject, Injectable, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { CommentGetResponseDTO, ContentDTO } from './dto/comment.response.dto';
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

  async getComments(option): Promise<CommentGetResponseDTO[]> {
    return await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .select(['comment.content', 'comment.id', 'user.userId AS userId', 'user.profileImg', 'user.nickname', 'champ.id', 'comment.reportNum', 'comment.createdAt', 'comment.category', 'comment.summonerName', 'summoner.summonerName'])
      .where(option)
      .orderBy({
        'comment.createdAt': 'DESC',
      })
      .getMany();
  }
  async postComment(value, option, target) {
    const { category } = value;

    // 챔피언 댓글
    await this.commentsRepository.createQueryBuilder().insert().into(CommentEntity).values(value).execute();

    const result = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.userId', 'user')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .select(['comment.content', 'comment.id', 'user.userId', 'user.profileImg', 'user.nickname', 'champ.id', 'comment.reportNum', 'comment.createdAt', 'comment.category', 'comment.summonerName', 'summoner.summonerName'])
      .where(option)
      .orderBy({
        'comment.createdAt': 'DESC',
      })
      .getMany();

    // 캐싱 set
    await this.cacheManager.set(`/comments/${category}/${encodeURI(String(target))}`, JSON.stringify(result), { ttl: this.configService.get('REDIS_TTL') });

    return { success: true, message: '평판 업로드 완료했습니다' };
  }

  async updateReportNum(id): Promise<ContentDTO> {
    await this.commentsRepository.manager.transaction(async (transactionalEntityManager) => {
      const data = await transactionalEntityManager.createQueryBuilder().select('COMMENT').from(CommentEntity, 'COMMENT').where('COMMENT.id = :id', { id }).getOne();
      await transactionalEntityManager
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ reportNum: data.reportNum + 1 })
        .where('id = :id', { id })
        .execute();
    });
    const data = await this.commentsRepository.createQueryBuilder('comment').select().leftJoinAndSelect('comment.userId', 'user').leftJoinAndSelect('comment.champId', 'champ').leftJoinAndSelect('comment.summonerName', 'summoner').where('comment.id = :id', { id }).getOne();

    return data;
  }
  async deleteComment(id: string, userId: string): Promise<ContentDTO> {
    const value = await this.commentsRepository.createQueryBuilder('comment').select().leftJoinAndSelect('comment.userId', 'user').leftJoinAndSelect('comment.champId', 'champ').leftJoinAndSelect('comment.summonerName', 'summoner').where('comment.id = :id', { id }).getOne();
    await this.commentsRepository.manager.transaction(async (transactionalEntityManager) => {
      const data = await transactionalEntityManager.createQueryBuilder().select('COMMENT').from(CommentEntity, 'COMMENT').where('COMMENT.id = :id', { id }).andWhere('COMMENT.userId = :userId', { userId }).getOne();
      await transactionalEntityManager.createQueryBuilder().delete().from(CommentEntity).where('id = :id', { id: data.id }).andWhere('userId = :userId', { userId }).execute();
    });

    return value;
  }

  async updateContent(id: string, userId: string, content: string): Promise<ContentDTO> {
    await this.commentsRepository.manager.transaction(async (transactionalEntityManager) => {
      const data = await transactionalEntityManager.createQueryBuilder().select('COMMENT').from(CommentEntity, 'COMMENT').where('COMMENT.id = :id', { id }).andWhere('COMMENT.userId = :userId', { userId }).getOne();
      await transactionalEntityManager.createQueryBuilder().update(CommentEntity).set({ content }).where('id = :id', { id: data.id }).andWhere('userId = :userId', { userId }).execute();
    });
    return await this.commentsRepository.createQueryBuilder('comment').select().leftJoinAndSelect('comment.userId', 'user').leftJoinAndSelect('comment.champId', 'champ').leftJoinAndSelect('comment.summonerName', 'summoner').where('comment.id = :id', { id }).getOne();
  }

  // async deleteCommentCache(category: string, target: string | number) {
  //   await this.cacheManager.del(`/commments/${category}/${target}`);
  //   return;
  // }
  async setCommentCache(category: string, target: string | number, option) {
    const result = await this.commentsRepository.createQueryBuilder('comment').leftJoinAndSelect('comment.userId', 'user').leftJoinAndSelect('comment.champId', 'champ').leftJoinAndSelect('comment.summonerName', 'summoner').select(['comment.content', 'comment.id', 'user.userId', 'user.profileImg', 'user.nickname', 'champ.id', 'comment.reportNum', 'comment.createdAt', 'comment.category', 'comment.summonerName', 'summoner.summonerName']).where(option).getMany();

    // 캐싱 적용
    await this.cacheManager.set(`/comments/${category}/${target}`, JSON.stringify(result), { ttl: this.configService.get('REDIS_TTL') });
    return;
  }
}
