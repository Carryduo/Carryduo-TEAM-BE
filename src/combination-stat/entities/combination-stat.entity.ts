import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'COMBINATION_STAT',
})
export class CombinationStatEntity extends CommonEntity {
  @ApiProperty({
    example: 'top-jungle/mid-jungle/ad-support/ 챔피언 상세 조회시: 챔피언id',
    description: '조합승률을 보여줄',
    required: false,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: '1',
    description: '조합승률 데이터의 순위',
    required: false,
  })
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  rankInCategory: number;

  @ApiProperty({
    example: '1',
    description: '조합승률 데이터의 티어',
    required: false,
  })
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  tier: number;

  @ApiProperty({
    example: '59.1',
    description: '조합승률',
    required: false,
  })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: false })
  @IsNumber()
  @IsNotEmpty()
  winrate: number;

  @ApiProperty({
    example: '595',
    description: '표본수',
    required: false,
  })
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  sampleNum: number;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @ApiProperty({
    example: '56',
    description: '기준 챔피언 ID',
    required: false,
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
  @ApiProperty({
    example: '56',
    description: '조합 챔피언 ID',
    required: false,
  })
  @JoinColumn([
    {
      name: 'subChampId',
      referencedColumnName: 'id',
    },
  ])
  subChampId: ChampEntity;
}
