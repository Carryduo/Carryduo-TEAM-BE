import { CombinationStatEntity } from './../../combination-stat/entities/combination-stat.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChampSkillInfoEntity } from './champSkillInfo.entity';
import { SummonerEntity } from 'src/summoner/entities/summoner.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { ApiProperty, OmitType } from '@nestjs/swagger';

@Entity({
  name: 'CHAMP',
})
export class ChampEntity extends OmitType(CommonEntity, ['id'] as const) {
  @ApiProperty({
    example: 86,
    description: '챔피언 고유 ID',
    required: true,
  })
  @PrimaryColumn({
    name: 'chmapId',
    type: 'varchar',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: '가렌',
    description: '챔피언 한글 이름',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champNameKo: string;

  @ApiProperty({
    example: 'Garen',
    description: '챔피언 영문 이름',
    required: true,
  })
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  champNameEn: string;

  @ApiProperty({
    example: 'example.png',
    description: '챔피언 이미지 url',
    required: true,
  })
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
    (summoner: SummonerEntity) => [
      summoner.mostChamp1,
      summoner.mostChamp2,
      summoner.mostChamp3,
    ],
    {
      cascade: true, // 사용자를 통해 블로그가 추가, 수정, 삭제되고 사용자가 저장되면 추가된 블로그도 저장된다.
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
      combinationStat.targetChampId,
      combinationStat.subChampId,
    ],
    {
      cascade: true,
    },
  )
  combinationStat: CombinationStatEntity;
}
