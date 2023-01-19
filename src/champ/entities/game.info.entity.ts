import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from './champ.entity';

@Entity({
  name: 'GAME_INFO',
})
export class GameInfoEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  gameCount: number;

  @Column({ type: 'varchar', nullable: false })
  version: string;
}
