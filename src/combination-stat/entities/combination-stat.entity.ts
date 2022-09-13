import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';

@Entity({
  name: 'COMBINATION_STAT',
})
export class CombinationStatEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  category: string;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  rankInCategory: number;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  tier: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  @IsNumber()
  @IsNotEmpty()
  winrate: number;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  sampleNum: number;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'targetChampId',
      referencedColumnName: 'id',
    },
  ])
  targetChampId: ChampEntity;

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
}
