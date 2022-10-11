import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';

@Entity({
  name: 'SIMULATION',
})
export class SimulationEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  category: number;

  @Column({ type: 'decimal', precision: 7, scale: 4, nullable: false })
  winrate: number;

  @Column({ type: 'int', nullable: false })
  sampleNum: number;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'champ1Id',
      referencedColumnName: 'id',
    },
  ])
  champ1Id: ChampEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'champ2Id',
      referencedColumnName: 'id',
    },
  ])
  champ2Id: ChampEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'champ3Id',
      referencedColumnName: 'id',
    },
  ])
  champ3Id: ChampEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'champ4Id',
      referencedColumnName: 'id',
    },
  ])
  champ4Id: ChampEntity;
}
