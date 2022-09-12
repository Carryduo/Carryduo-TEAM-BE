import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({
  name: 'CHAMP',
})
export class ChampEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champNameKo: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champNameEn: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champImg: string;
}
