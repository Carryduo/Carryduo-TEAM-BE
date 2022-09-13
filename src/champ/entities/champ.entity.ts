import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChampSkillInfoEntity } from './champSkillInfo.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';

@Entity({
  name: 'CHAMP',
})
export class ChampEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champNameKo: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champNameEn: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champImg: string;

  @OneToMany(
    () => ChampSkillInfoEntity,
    (champSkillInfo: ChampSkillInfoEntity) => champSkillInfo.champId,
    {
      cascade: true, // 사용자를 통해 블로그가 추가, 수정, 삭제되고 사용자가 저장되면 추가된 블로그도 저장된다.
    },
  )
  champSkillInfo: ChampSkillInfoEntity;

  @OneToMany(
    () => SummonerEntity,
    (summoner: SummonerEntity) => summoner.champId,
    {
      cascade: true, // 사용자를 통해 블로그가 추가, 수정, 삭제되고 사용자가 저장되면 추가된 블로그도 저장된다.
    },
  )
  summoner: SummonerEntity;
}
