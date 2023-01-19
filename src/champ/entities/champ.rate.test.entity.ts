import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from './champ.entity';

@Entity({
  name: 'CHAMP_RATE',
})
export class Champ_Rate_Entity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  win: number;

  @Column({ type: 'int', nullable: false })
  lose: number;

  @Column({ type: 'varchar', nullable: false })
  position: string;

  @Column({ type: 'int', nullable: false })
  pickCount: number;

  @Column({ type: 'varchar', nullable: false })
  version: string;

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
