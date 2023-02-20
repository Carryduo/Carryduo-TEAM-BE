import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { CommentEntity } from '../../comments/entities/comments.entity';
import { SummonerHistoryEntity } from './summoner.history.entity';

@Entity({
  name: 'SUMMONER',
})
export class SummonerEntity extends CommonEntity {
  @Column({ name: 'summonerName', unique: true, type: 'varchar' })
  summonerName: string;

  @Column({ type: 'varchar', nullable: false })
  summonerId: string;

  @Column({ type: 'varchar', nullable: false })
  summonerPuuId: string;

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

  @OneToMany(() => SummonerHistoryEntity, (history: SummonerHistoryEntity) => history.summonerName)
  history?: SummonerHistoryEntity;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'mostChamp1',
      referencedColumnName: 'id',
    },
  ])
  mostChamp1: ChampEntity;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'mostChamp2',
      referencedColumnName: 'id',
    },
  ])
  mostChamp2: ChampEntity;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'mostChamp3',
      referencedColumnName: 'id',
    },
  ])
  mostChamp3: ChampEntity;

  @OneToMany(() => SubscriptionEntity, (subscription: SubscriptionEntity) => subscription.summonerName, {
    cascade: true,
  })

  subscription: SubscriptionEntity;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.summonerName, {
    cascade: true,
  })

  comment: CommentEntity;

  static createSummonerNameOption(summonerName: string) {
    const summoner = new SummonerEntity();
    summoner.summonerName = summonerName;
    return summoner;
  }
}
