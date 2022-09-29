import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from './summoner.entity';

@Entity({
  name: 'SUMMONERHISTORY',
})
export class SummonerHistoryEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false, default: 0 })
  win: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  sampleNum: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  kill: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  death: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  assist: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  top: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  jungle: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  mid: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  ad: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  support: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  recent1Win: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  recent1Lose: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  recent2Win: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  recent2Lose: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  recent3Win: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  recent3Lose: number;

  @OneToOne(
    () => SummonerEntity,
    (summoner: SummonerEntity) => summoner.summonerName,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn([{ name: 'summonerName', referencedColumnName: 'summonerName' }])
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
