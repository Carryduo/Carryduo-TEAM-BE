import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { kakaoPayload } from './dto/kakao.payload';
import { CommentEntity } from 'src/comments/entities/comments.entity';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async checkAndSignUser(data: kakaoPayload) {
    const { socialId, social } = data;
    const user = await this.usersRepository
      .createQueryBuilder()
      .select('USER')
      .from(UserEntity, 'USER')
      .where('USER.socialId = :socialId', { socialId })
      .andWhere('USER.social = :social', { social })
      .getOne();
    if (user === null) {
      let newUser;
      await this.usersRepository.manager.transaction(
        async (transactionalEntityManager) => {
          await this.usersRepository
            .createQueryBuilder()
            .insert()
            .into(UserEntity)
            .values({
              ...data,
            })
            .execute();
          newUser = await transactionalEntityManager
            .createQueryBuilder()
            .select('USER')
            .from(UserEntity, 'USER')
            .where('USER.socialId = :socialId', { socialId })
            .andWhere('USER.social = :social', { social })
            .getOne();
        },
      );
      return newUser;
    }
    return user;
  }

  async findById(userId: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select()
      .where('user.userId = :userId', { userId })
      .getOne();
  }

  async deleteUser(userId: string) {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('userId = :userId', { userId })
      .execute();
    return;
  }

  async findCommentList(userId: string) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .select(['comment.id'])
      .where('comment.userId = :userId', { userId })
      .getMany();
  }

  async findCommentOptions(id: string) {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.champId', 'champ')
      .leftJoinAndSelect('comment.summonerName', 'summoner')
      .select([
        'comment.category',
        'comment.champId',
        'comment.summonerName',
        'champ.id',
        'summoner.summonerName',
      ])
      .where('comment.id = :id', { id })
      .getOne();
  }
}
