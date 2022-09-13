import { CommonEntity } from '../../common/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity({
  name: 'SUBSCRIPTION',
})
export class SubscriptionEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
    },
  ])
  user: UserEntity;

  @ManyToOne(() => SummonerEntity, (summoner: SummonerEntity) => summoner.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'summonerId',
      referencedColumnName: 'id',
    },
  ])
  summoner: SummonerEntity;
}
