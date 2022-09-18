import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({
  name: 'USER',
})
export class UserEntity extends CommonEntity {
  @ApiProperty({
    example: '242787845',
    description: 'socialId',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '소셜로그인 아이디' })
  @Column({ type: 'varchar', nullable: false })
  socialId: string;

  @ApiProperty({
    example: 'kakao',
    description: 'social',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '소셜 로그인 타입' })
  @Column({ type: 'varchar', nullable: false })
  social: string;

  @ApiProperty({
    example: '홍길동',
    description: 'nickname',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @ApiProperty({
    example: 'http://k.kakaocdn.net/dn/BgCup/dsdref/zsadefjdf/img_640x640.jpg',
    description: 'profileImg',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '프로필 이미지를 설정해주세요' })
  @Column({ type: 'varchar', nullable: false })
  profileImg: string;

  @ApiProperty({
    example: '서폿유저 실버2입니다. 듀오 환영!',
    description: 'bio',
    required: false,
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @ApiProperty({
    example: 'AD',
    description: 'preferPosition',
    required: false,
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  preferPosition: string;

  @ApiProperty({
    example: 'silver',
    description: 'tier',
    required: false,
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  tier: string;

  @ApiProperty({
    example: '1 or 0',
    description: 'enableChat',
    required: false,
  })
  @IsBoolean()
  @Column({ type: 'boolean', default: true })
  enableChat: boolean;
  //

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity: SubscriptionEntity) => subscriptionEntity.userId,
    {
      cascade: true,
    },
  )
  subscription: SubscriptionEntity;

  @OneToMany(
    () => CommentEntity,
    (commentEntity: CommentEntity) => commentEntity.id,
    {
      cascade: true,
    },
  )
  comment: CommentEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    // eager: true,
  })
  @ApiProperty({
    example: '56',
    description: '선호챔피언1',
    required: false,
  })
  @JoinColumn([
    {
      name: 'preferChamp1',
      referencedColumnName: 'id',
    },
  ])
  preferChamp1: Promise<ChampEntity>;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    // eager: true,
  })
  @ApiProperty({
    example: '56',
    description: '선호챔피언2',
    required: false,
  })
  @JoinColumn([
    {
      name: 'preferChamp2',
      referencedColumnName: 'id',
    },
  ])
  preferChamp2: Promise<ChampEntity>;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    // eager: true,
  })
  @ApiProperty({
    example: '56',
    description: '선호챔피언3',
    required: false,
  })
  @JoinColumn([
    {
      name: 'preferChamp3',
      referencedColumnName: 'id',
    },
  ])
  preferChamp3: Promise<ChampEntity>;
}
