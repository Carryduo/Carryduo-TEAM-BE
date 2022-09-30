import { CombinationStatEntity } from './../../combination-stat/entities/combination-stat.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ChampSkillInfoEntity } from './champSkillInfo.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { OmitType } from '@nestjs/swagger';
import { SummonerHistoryEntity } from 'src/summoner/entities/summoner.history.entity';

@Entity({
  name: 'CHAMP',
})
export class ChampEntity extends OmitType(CommonEntity, ['id'] as const) {
  @PrimaryColumn({ name: 'chmapId', type: 'varchar' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  champNameKo: string;

  @Column({ type: 'varchar', nullable: false })
  champNameEn: string;

  @Column({ type: 'varchar', nullable: false })
  champImg: string;

  @Column({ type: 'int', nullable: true })
  winRate: number;

  @Column({ type: 'int', nullable: true })
  banRate: number;

  @Column({ type: 'int', nullable: true })
  pickRate: number;

  @OneToMany(
    () => ChampSkillInfoEntity,
    (champSkillInfo: ChampSkillInfoEntity) => champSkillInfo.champId,
    {
      cascade: true,
    },
  )
  champSkillInfo: ChampSkillInfoEntity;

  @OneToMany(
    () => SummonerEntity,
    (summoner: SummonerEntity) => [
      summoner.mostChamp1,
      summoner.mostChamp2,
      summoner.mostChamp3,
    ],
    {
      cascade: true,
    },
  )
  summoner: SummonerEntity;

  @OneToMany(
    () => UserEntity,
    (user: UserEntity) => [
      user.preferChamp1,
      user.preferChamp2,
      user.preferChamp3,
    ],
    {
      cascade: true,
    },
  )
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.champId, {
    cascade: true,
  })
  comment: CommentEntity;

  @OneToMany(
    () => CombinationStatEntity,
    (combinationStat: CombinationStatEntity) => [
      combinationStat.mainChampId,
      combinationStat.subChampId,
    ],
    {
      cascade: true,
    },
  )
  combinationStat: CombinationStatEntity;
}
