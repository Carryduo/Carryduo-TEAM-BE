import { PickType } from '@nestjs/swagger';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { CommentEntity } from '../comments/entities/comments.entity';

// TODO: SELECT의 경우, RETURN 값을 보내주기
@Injectable()
export class AdminRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,

    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async checkUser(
    data: UserEntity,
  ): Promise<{ userId: string; nickname: string }> {
    const { socialId, social } = data;
    return await this.usersRepository
      .createQueryBuilder()
      .select(['USER.userId', 'USER.nickname'])
      .from(UserEntity, 'USER')
      .where('USER.socialId = :socialId', { socialId })
      .andWhere('USER.social = :social', { social })
      .getOne();
  }

  async createUser(
    data: UserEntity,
  ): Promise<{ userId: string; nickname: string }> {
    const { social, socialId } = data;
    let newUser: UserEntity;
    await this.usersRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await this.usersRepository
          .createQueryBuilder()
          .insert()
          .into(UserEntity)
          .values(data)
          .execute();
        newUser = await transactionalEntityManager
          .createQueryBuilder()
          .select(['USER.userId', 'USER.nickname'])
          .from(UserEntity, 'USER')
          .where('USER.socialId = :socialId', { socialId })
          .andWhere('USER.social = :social', { social })
          .getOne();
      },
    );

    return newUser;
  }

  async findById(userId: string): Promise<UserEntity> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.userId', 'user.nickname', 'user.profileImg'])
      .where('user.userId = :userId', { userId })
      .getOne();
  }

  async deleteUser(option: UserEntity) {
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('userId = :userId', option)
      .execute();
    return;
  }

  async findCommentList(userId: string): Promise<{ id: string }[]> {
    return await this.commentRepository
      .createQueryBuilder('comment')
      .select(['comment.id'])
      .where('comment.userId = :userId', { userId })
      .getMany();
  }

  async findCommentOptions(id: string): Promise<{
    category: string;
    id: string;
    summonerName: { summonerName: string };
    champId: { id: string };
  }> {
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
