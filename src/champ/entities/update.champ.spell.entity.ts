import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from './champ.entity';

@Entity({
  name: 'CHAMP_SPELL',
})
export class UpdateChampSpellEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  spell1: number;

  @Column({ type: 'int', nullable: false })
  spell2: number;

  @Column({ type: 'int', nullable: false })
  playCount: number;

  @Column({ type: 'varchar', nullable: false })
  version: string;

  @Column({ type: 'varchar', nullable: false })
  position: string;

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
