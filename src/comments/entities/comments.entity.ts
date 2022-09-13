import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';

@Entity({
  name: 'COMMENT',
})
export class CommentEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  category: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  reportNum: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
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
  })
  @JoinColumn([
    {
      name: 'champId',
      referencedColumnName: 'id',
    },
  ])
  champId: UserEntity;

  @ManyToOne(
    () => SummonerEntity,
    (summonerEntity: SummonerEntity) => summonerEntity.id,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'summonerId',
      referencedColumnName: 'id',
    },
  ])
  summonerId: UserEntity;
}
