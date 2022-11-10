import { SummonerCommonDTO } from './../../summoner/dto/summoner/summoner.common.dto';
import { ChampCommonDTO } from 'src/champ/dto/champ/champ.common.dto';
import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity({
  name: 'COMMENT',
})
export class CommentEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  reportNum: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userId, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'userId',
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
  champId: ChampEntity;

  @ManyToOne(
    () => SummonerEntity,
    (summonerEntity: SummonerEntity) => summonerEntity.summonerName,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    {
      name: 'summonerName',
      referencedColumnName: 'summonerName',
    },
  ])
  summonerName: SummonerEntity;
}
