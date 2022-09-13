import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';

@Entity({
  name: 'SUMMONER',
})
export class SummonerEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  summonerName: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  summonerIcon: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  tier: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  tierImg: string;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  lp: number;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  win: number;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  lose: number;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  winRate: number;

  @ManyToOne(() => ChampEntity, (champ: ChampEntity) => champ.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'mostChampionList',
      referencedColumnName: 'id',
    },
  ])
  champId: ChampEntity[];

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity: SubscriptionEntity) => subscriptionEntity.summoner,
    {
      cascade: true,
    },
  )
  subscription: SubscriptionEntity;
}
