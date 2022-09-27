import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'SUMMONER',
})
export class SummonerEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  summonerName: string;

  @Column({ type: 'varchar', nullable: false })
  summonerIcon: string;

  @Column({ type: 'varchar', nullable: false })
  summonerLevel: string;

  @Column({ type: 'varchar', nullable: false })
  tier: string;

  @Column({ type: 'varchar', nullable: false })
  tierImg: string;

  @Column({ type: 'int', nullable: false })
  lp: number;

  @Column({ type: 'int', nullable: false })
  win: number;

  @Column({ type: 'int', nullable: false })
  lose: number;

  @Column({ type: 'int', nullable: false })
  winRate: number;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'mostChamp1',
      referencedColumnName: 'id',
    },
  ])
  mostChamp1: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'mostChamp2',
      referencedColumnName: 'id',
    },
  ])
  mostChamp2: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'mostChamp3',
      referencedColumnName: 'id',
    },
  ])
  mostChamp3: string;

  @OneToMany(
    () => SubscriptionEntity,
    (subscription: SubscriptionEntity) => subscription.summonerId,
    {
      cascade: true,
    },
  )
  subscription: SubscriptionEntity;

  @OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.summonerId,
    {
      cascade: true,
    },
  )
  comment: CommentEntity;
}
