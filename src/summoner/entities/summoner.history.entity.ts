import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { SummonerEntity } from './summoner.entity';
import { ChampEntity } from 'src/champ/entities/champ.entity';

@Entity({
  name: 'SUMMONERHISTORY',
})
export class SummonerHistoryEntity extends CommonEntity {
  @Column({ type: 'boolean', nullable: false, default: 0 })
  win: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  kill: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  death: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  assist: number;

  @Column({ type: 'int', nullable: false })
  position: number;

  @Column({ type: 'varchar', nullable: false })
  matchId: string;

  @Column({ type: 'varchar', nullable: false })
  summonerName: string;

  @ManyToOne(() => SummonerEntity, (summoner: SummonerEntity) => summoner.summonerName, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'summonerId',
      referencedColumnName: 'summonerId',
    },
  ])
  summonerId: SummonerEntity;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
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
}
