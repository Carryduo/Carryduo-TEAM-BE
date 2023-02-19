import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from '../../champ/entities/champ.entity';

@Entity({
  name: 'COMBINATION_STAT',
})
export class CombinationStatEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  category: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  win: number;

  @Column({ type: 'int', nullable: false, default: 0 })
  lose: number;

  @Column({ type: 'int', nullable: false })
  sampleNum: number;

  @Column({ type: 'varchar', nullable: false, default: 'old' })
  version: string;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'mainChampId',
      referencedColumnName: 'id',
    },
  ])
  mainChampId: ChampEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'subChampId',
      referencedColumnName: 'id',
    },
  ])
  subChampId: ChampEntity;

  static createSelectOption(data: { category?: number; version?: string }) {
    const combiantionStat = new CombinationStatEntity();
    combiantionStat.category = data.category;
    combiantionStat.version = data.version;
    return combiantionStat;
  }
}
