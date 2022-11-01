import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { ChampBasicInfoDTO } from 'src/champ/dto/champ/champ.dto';

@Entity({
  name: 'COMBINATION_STAT',
})
export class CombinationStatEntity extends CommonEntity {
  @Column({ type: 'int', nullable: false })
  category: number;

  @Column({ type: 'int', nullable: false })
  rankInCategory: number;

  @Column({ type: 'int', nullable: false })
  tier: number;

  @Column({ type: 'decimal', precision: 7, scale: 4, nullable: false })
  winrate: number;

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
  mainChampId: string | ChampBasicInfoDTO;

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
  subChampId: string | ChampBasicInfoDTO;
}
