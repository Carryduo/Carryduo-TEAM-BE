import { CombinationStatEntity } from './../../combination-stat/entities/combination-stat.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ChampSkillInfoEntity } from './champSkillInfo.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { OmitType } from '@nestjs/swagger';
import { ChampSpellEntity } from './champ.spell';
import { SimulationEntity } from 'src/simulation/entities/simulation.entity';
import { ChampRateEntity } from './champ.rate.entity';
import { Champ_Rate_Entity } from './champ.rate.test.entity';
import { Champ_BAN_Entity } from './champ.ban.entity';
import { Champ_SPELL_Entity } from './champ.spell.test.entity';

@Entity({
  name: 'CHAMP',
})
export class ChampEntity extends OmitType(CommonEntity, ['id'] as const) {
  @PrimaryColumn({ name: 'champId', type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', nullable: false })
  champNameKo: string;

  @Column({ type: 'varchar', nullable: false })
  champNameEn: string;

  @Column({ type: 'varchar', nullable: false })
  champMainImg: string;

  @Column({ type: 'varchar', nullable: false })
  champImg: string;

  @Column({ type: 'varchar', nullable: false })
  position: string;

  //업데이트 챔프 테이블
  @OneToMany(() => Champ_Rate_Entity, (champ_rate: Champ_Rate_Entity) => champ_rate.champId, {
    cascade: true,
  })
  champ_Rate: Champ_Rate_Entity;

  @OneToMany(() => Champ_BAN_Entity, (champ_ban: Champ_BAN_Entity) => champ_ban.champId, {
    cascade: true,
  })
  champ_ban: Champ_BAN_Entity;

  @OneToMany(() => Champ_SPELL_Entity, (champ_spell: Champ_SPELL_Entity) => champ_spell.champId, {
    cascade: true,
  })
  champ_spell: Champ_SPELL_Entity;

  //기존 챔프 테이블
  @OneToMany(() => ChampRateEntity, (champRate: ChampRateEntity) => champRate.champId, {
    cascade: true,
  })
  champRate: ChampRateEntity;

  @OneToMany(() => ChampSpellEntity, (champSpell: ChampSpellEntity) => champSpell.champId, {
    cascade: true,
  })
  champSpell: ChampSpellEntity;

  @OneToMany(() => ChampSkillInfoEntity, (champSkillInfo: ChampSkillInfoEntity) => champSkillInfo.champId, {
    cascade: true,
  })
  champSkillInfo: ChampSkillInfoEntity;

  @OneToMany(() => SummonerEntity, (summoner: SummonerEntity) => [summoner.mostChamp1, summoner.mostChamp2, summoner.mostChamp3], {
    cascade: true,
  })
  summoner: SummonerEntity;

  @OneToMany(() => UserEntity, (user: UserEntity) => [user.preferChamp1, user.preferChamp2, user.preferChamp3], {
    cascade: true,
  })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment: CommentEntity) => comment.champId, {
    cascade: true,
  })
  comment: CommentEntity;

  @OneToMany(() => CombinationStatEntity, (combinationStat: CombinationStatEntity) => [combinationStat.mainChampId, combinationStat.subChampId], {
    cascade: true,
  })
  combinationStat: CombinationStatEntity;

  @OneToMany(() => SimulationEntity, (simulation: SimulationEntity) => [simulation.champ1Id, simulation.champ2Id, simulation.champ3Id, simulation.champ4Id], {
    cascade: true,
  })
  simulation: SimulationEntity;
}
