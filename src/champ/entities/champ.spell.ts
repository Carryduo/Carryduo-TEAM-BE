import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from './champ.entity';

@Entity({
  name: 'CHAMPSPELL',
})
export class ChampSpellEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  spell1: number;

  @Column({ type: 'int', nullable: false })
  spell2: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  pickRate: number;

  @Column({ type: 'int', nullable: false })
  sampleNum: number;

  @Column({ type: 'varchar', nullable: false, default: 'old' })
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
