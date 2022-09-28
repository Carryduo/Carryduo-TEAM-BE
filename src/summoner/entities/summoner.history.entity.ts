import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from './summoner.entity';

@Entity({
  name: 'SUMMONERHISTORY',
})
export class SummonerHistoryEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  win: number;

  @Column({ type: 'int', nullable: false })
  lose: number;

  @Column({ type: 'int', nullable: false })
  winRate: number;

  @Column({ type: 'int', nullable: false })
  kill: number;

  @Column({ type: 'int', nullable: false })
  death: number;

  @Column({ type: 'int', nullable: false })
  assist: number;

  @Column({ type: 'int', nullable: false })
  top: number;

  @Column({ type: 'int', nullable: false })
  jungle: number;

  @Column({ type: 'int', nullable: false })
  mid: number;

  @Column({ type: 'int', nullable: false })
  ad: number;

  @Column({ type: 'int', nullable: false })
  support: number;

  @Column({ type: 'int', nullable: false })
  recent1Win: number;

  @Column({ type: 'int', nullable: false })
  recent1Lose: number;

  @Column({ type: 'int', nullable: false })
  recent2Win: number;

  @Column({ type: 'int', nullable: false })
  recent2Lose: number;

  @Column({ type: 'int', nullable: false })
  recent3Win: number;

  @Column({ type: 'int', nullable: false })
  recent3Lose: number;

  @OneToOne(
    () => SummonerEntity,
    (summoner: SummonerEntity) => summoner.summonerName,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn()
  summonerName: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'recentChamp1',
      referencedColumnName: 'id',
    },
  ])
  recentChamp1: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'recentChamp2',
      referencedColumnName: 'id',
    },
  ])
  recentChamp2: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'recentChamp3',
      referencedColumnName: 'id',
    },
  ])
  recentChamp3: string;
}
