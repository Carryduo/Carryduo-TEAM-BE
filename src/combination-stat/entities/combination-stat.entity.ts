import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Entity({
  name: 'COMBINATION-STAT',
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
}
