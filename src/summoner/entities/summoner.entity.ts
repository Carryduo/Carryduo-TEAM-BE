import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'SUMMONER',
})
export class SummonerEntity extends CommonEntity {
  @ApiProperty({
    example: '할배탈',
    description: '소환사 이름',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  summonerName: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 아이콘',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  summonerIcon: string;

  @ApiProperty({
    example: 'SILVER I',
    description: '소환사 티어',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  tier: string;

  @ApiProperty({
    example: 'example.png',
    description: '소환사 티어 이미지',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  tierImg: string;

  @ApiProperty({
    example: '98',
    description: '소환사 리그 포인트',
    required: true,
  })
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  lp: number;

  @ApiProperty({
    example: '75',
    description: '소환사 승리 수',
    required: true,
  })
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  win: number;

  @ApiProperty({
    example: '55',
    description: '소환사 패배 수',
    required: true,
  })
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  lose: number;

  @ApiProperty({
    example: '57',
    description: '소환사 승률',
    required: true,
  })
  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  winRate: number;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @ApiProperty({
    example: '81',
    description: '모스트 챔피언1',
    required: true,
  })
  @JoinColumn([
    {
      name: 'mostChamp1',
      referencedColumnName: 'id',
    },
  ])
  mostChamp1: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @ApiProperty({
    example: '412',
    description: '모스트 챔피언2',
    required: true,
  })
  @JoinColumn([
    {
      name: 'mostChamp2',
      referencedColumnName: 'id',
    },
  ])
  mostChamp2: string;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @ApiProperty({
    example: '222',
    description: '모스트 챔피언3',
    required: true,
  })
  @JoinColumn([
    {
      name: 'mostChamp3',
      referencedColumnName: 'id',
    },
  ])
  mostChamp3: string;

  @OneToMany(
    () => SubscriptionEntity,
    (subscription: SubscriptionEntity) => subscription.summonerId,
    {
      cascade: true,
    },
  )
  subscription: SubscriptionEntity;

  @OneToMany(
    () => CommentEntity,
    (comment: CommentEntity) => comment.summonerId,
    {
      cascade: true,
    },
  )
  comment: CommentEntity;
}
