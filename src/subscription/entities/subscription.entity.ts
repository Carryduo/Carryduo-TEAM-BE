import { CommonEntity } from '../../common/entities/common.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
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
  userId: UserEntity;

  @ManyToOne(() => SummonerEntity, (summoner: SummonerEntity) => summoner.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'summonerId',
      referencedColumnName: 'id',
    },
  ])
  summonerId: SummonerEntity;
}
