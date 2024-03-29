import { CommonEntity } from '../../common/entities/common.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SummonerEntity } from '../../summoner/entities/summoner.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'SUBSCRIPTION',
})
export class SubscriptionEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, (user: UserEntity) => user.userId, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '유저 ID',
    required: false,
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'userId',
    },
  ])
  userId: UserEntity;

  @ManyToOne(
    () => SummonerEntity,
    (summoner: SummonerEntity) => summoner.summonerName,
    {
      onDelete: 'CASCADE',
    },
  )
  @ApiProperty({
    example: 'xzczcaQWWWE23',
    description: '구독한 소환사 ID',
    required: false,
  })
  @JoinColumn([
    {
      name: 'summonerName',
      referencedColumnName: 'summonerName',
    },
  ])
  summonerName: SummonerEntity;
}
