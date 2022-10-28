import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ChampEntity } from './champ.entity';

@Entity({
  name: 'CHAMPINFO',
})
export class ChampInfoEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  champNameKo: string;

  @Column({ type: 'varchar', nullable: false })
  champNameEn: string;

  @Column({ type: 'varchar', nullable: false })
  champMainImg: string;

  @Column({ type: 'varchar', nullable: false })
  champImg: string;

  @OneToOne(() => ChampEntity)
  @JoinColumn([
    {
      name: 'champId',
      referencedColumnName: 'id',
    },
  ])
  champId: ChampEntity;
}
