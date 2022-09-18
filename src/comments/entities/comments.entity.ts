import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'COMMENT',
})
export class CommentEntity extends CommonEntity {
  @ApiProperty({
    example: 'summoner/champ',
    description: '평판글의 소속 카테고리(소환사에 대한/챔피언에 대한)',
    required: false,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: '짱입니다',
    description: '평판글 내용',
    required: false,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '2',
    description: '신고 받은 횟수',
    required: false,
  })
  @Column({ type: 'int', nullable: false, default: 0 })
  @IsNumber()
  @IsNotEmpty()
  reportNum: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '글 작성자 ID',
    required: false,
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
    },
  ])
  userId: UserEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @ApiProperty({
    example: '56',
    description: '챔피언 ID',
    required: false,
  })
  @JoinColumn([
    {
      name: 'champId',
      referencedColumnName: 'id',
    },
  ])
  champId: ChampEntity;

  @ManyToOne(
    () => SummonerEntity,
    (summonerEntity: SummonerEntity) => summonerEntity.id,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      eager: true,
    },
  )
  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '소환사 ID',
    required: false,
  })
  @JoinColumn([
    {
      name: 'summonerId',
      referencedColumnName: 'id',
    },
  ])
  summonerId: SummonerEntity;
}
