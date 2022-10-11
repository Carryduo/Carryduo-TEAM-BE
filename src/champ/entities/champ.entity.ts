import { CombinationStatEntity } from './../../combination-stat/entities/combination-stat.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ChampSkillInfoEntity } from './champSkillInfo.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { OmitType } from '@nestjs/swagger';
import { SummonerHistoryEntity } from 'src/summoner/entities/summoner.history.entity';
import { ChampSpellEntity } from './champ.spell';
import { SimulationEntity } from 'src/simulation/entities/simulation.entity';

@Entity({
  name: 'CHAMP',
})
export class ChampEntity extends OmitType(CommonEntity, ['id'] as const) {
  @PrimaryColumn({ name: 'champId', type: 'varchar' })
  id: number;

  @Column({ type: 'varchar', nullable: false })
  champNameKo: string;

  @Column({ type: 'varchar', nullable: false })
  champNameEn: string;

  @Column({ type: 'varchar', nullable: false })
  champMainImg: string;

  @Column({ type: 'varchar', nullable: false })
  champImg: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  winRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  banRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  pickRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  topRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  jungleRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  midRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  adRate: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: false })
  supportRate: number;

  @OneToMany(
    () => ChampSpellEntity,
    (champSpell: ChampSpellEntity) => champSpell.champId,
    {
      cascade: true,
    },
  )
  champSpell: ChampSpellEntity;

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

  @OneToMany(
    () => SimulationEntity,
    (simulation: SimulationEntity) => [
      simulation.champ1Id,
      simulation.champ2Id,
      simulation.champ3Id,
      simulation.champ4Id,
    ],
    {
      cascade: true,
    },
  )
  simulation: SimulationEntity;
}
