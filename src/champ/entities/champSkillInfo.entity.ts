import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from './champ.entity';

@Entity({
  name: 'CHAMPSKILLINFO',
})
export class ChampSkillInfoEntity extends CommonEntity {
  map(arg0: (value: any) => void) {
    throw new Error('Method not implemented.');
  }
  @Column({ type: 'varchar', nullable: false })
  skillId: string;

  @Column({ type: 'varchar', nullable: false })
  skillName: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  skillDesc: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  skillToolTip: string;

  @Column({ type: 'varchar', nullable: false })
  skillImg: string;

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
