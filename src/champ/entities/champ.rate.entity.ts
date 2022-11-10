import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from './champ.entity';

@Entity({
  name: 'CHAMPRATE',
})
export class ChampRateEntity extends CommonEntity {
  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  winRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  banRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  pickRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  topRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  jungleRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  midRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  adRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  supportRate: number;

  @Column({ type: 'varchar', nullable: false, default: 'old' })
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
