import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChampEntity } from './champ.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'CHAMPSKILLINFO',
})
export class ChampSkillInfoEntity extends CommonEntity {
  @ApiProperty({
    example: 'q',
    description: 'q | w | e | r | passive',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  skillId: string;

  @ApiProperty({
    example: '결정타',
    description: 'q | w | e | r | passive의 스킬 이름',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  skillName: string;

  @ApiProperty({
    example: '가렌의 이동 속도가 큰 폭으로 증가하고.....',
    description: 'q | w | e | r | passive의 스킬 설명',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  sikllDesc: string;

  @ApiProperty({
    example: '가렌에게 적용된 모든 둔화 효과가 제거되고.....',
    description: 'q | w | e | r | passive의 스킬 툴팁',
    required: true,
  })
  @Column({ type: 'varchar', nullable: true })
  @IsString()
  @IsNotEmpty()
  skillToolTip: string;

  @ApiProperty({
    example: 'example.png',
    description: 'q | w | e | r | passive의 스킬 이미지',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  skillImg: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'champId',
      referencedColumnName: 'id',
    },
  ])
  champId: ChampEntity;
  map: any;
}
