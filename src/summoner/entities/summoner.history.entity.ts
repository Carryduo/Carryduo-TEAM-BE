import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'SUMMONERHISTORY',
})
export class SummonerHistoryEntity extends CommonEntity {
  @Column({ type: 'boolean', nullable: false, default: 0 })
  win: boolean;

  @Column({ type: 'int', nullable: false, default: 0 })
  kill: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  death: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  assist: number;

  @Column({ type: 'int', nullable: false })
  position: number;

  @Column({ type: 'int', nullable: false, default: false })
  champId: number;

  @Column({ type: 'varchar', nullable: false })
  summonerName: string;

  @Column({ type: 'varchar', nullable: false })
  summonerId: string;

  @Column({ type: 'varchar', nullable: false })
  matchId: string;
}
