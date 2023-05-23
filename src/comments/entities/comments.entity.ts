import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { SummonerEntity } from '../../summoner/entities/summoner.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity({
  name: 'COMMENT',
})
export class CommentEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  reportNum: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
  ])
  userId: UserEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'champId',
      referencedColumnName: 'id',
    },
  ])
  champId: ChampEntity;

  @ManyToOne(
    () => SummonerEntity,
    (summonerEntity: SummonerEntity) => summonerEntity.summonerName,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'summonerName',
      referencedColumnName: 'summonerName',
    },
  ])
  summonerName: SummonerEntity;

  static createGetChampComentOption(category: string, target: ChampEntity) {
    const comment = new CommentEntity();
    comment.category = category;
    comment.champId = target;
    return comment;
  }

  static createGetSummonerCommentOption(
    category: string,
    target: SummonerEntity,
  ) {
    const comment = new CommentEntity();
    comment.category = category;
    comment.summonerName = target;
    return comment;
  }

  static createPostChampCommentOption(
    category: string,
    target: ChampEntity,
    content: string,
    userId: UserEntity,
  ): CommentEntity {
    const comment = new CommentEntity();
    comment.category = category;
    comment.champId = target;
    comment.content = content;
    comment.userId = userId;
    return comment;
  }

  static createPostSummonerCommentOption(
    category: string,
    target: SummonerEntity,
    content: string,
    userId: UserEntity,
  ): CommentEntity {
    const comment = new CommentEntity();
    comment.category = category;
    comment.summonerName = target;
    comment.content = content;
    comment.userId = userId;
    return comment;
  }

  static createUpdateCommentOption(
    id: string,
    userId: UserEntity,
    content: string,
  ) {
    const comment = new CommentEntity();
    comment.id = id;
    comment.userId = userId;
    comment.content = content;
    return comment;
  }

  static createUpdateReportNumOption(id: string) {
    const comment = new CommentEntity();
    comment.id = id;
    return comment;
  }

  static createDeleteCommentOption(id: string, userId: UserEntity) {
    const comment = new CommentEntity();
    comment.id = id;
    comment.userId = userId;
    return comment;
  }
}
