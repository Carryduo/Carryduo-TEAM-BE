import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity({
  name: 'USER',
})
export class UserEntity extends CommonEntity {
  @IsString()
  @IsNotEmpty({ message: '소셜로그인 아이디' })
  @Column({ type: 'varchar', nullable: false })
  socialId: string;

  @IsString()
  @IsNotEmpty({ message: '소셜 로그인 타입' })
  @Column({ type: 'varchar', nullable: false })
  social: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '프로필 이미지를 설정해주세요' })
  @Column({ type: 'varchar', nullable: false })
  profileImg: string;

  @IsString()
  @IsNotEmpty({ message: '자기소개를 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  bio: string;

  @IsString()
  @IsNotEmpty({ message: '선호 포지션을 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  preferPosition: string;

  @IsString()
  @IsNotEmpty({ message: '티어를 입력해주세요' })
  @Column({ type: 'varchar', nullable: false })
  tier: string;

  @IsBoolean()
  @IsNotEmpty({ message: '채팅활성화 여부를 입력해주세요' })
  @Column({ type: 'boolean', nullable: false, default: true })
  enableChat: boolean;

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity: SubscriptionEntity) => subscriptionEntity.user,
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
}
