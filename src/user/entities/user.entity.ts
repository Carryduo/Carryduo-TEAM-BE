import { OmitType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ChampEntity } from '../../champ/entities/champ.entity';
import { CommentEntity } from '../../comments/entities/comments.entity';
import { CommonEntity } from '../../common/entities/common.entity';
import { SubscriptionEntity } from '../../subscription/entities/subscription.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'USER',
})
export class UserEntity extends OmitType(CommonEntity, ['id']) {
  @IsUUID()
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ type: 'varchar', nullable: false })
  socialId: string;

  @Column({ type: 'varchar', nullable: false })
  social: string;

  @Column({ type: 'varchar', nullable: false })
  nickname: string;

  @Column({ type: 'varchar', nullable: false })
  profileImg: string;

  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @Column({ type: 'varchar', nullable: true })
  preferPosition: string;

  @Column({ type: 'int', nullable: true })
  tier: number;

  @Column({ type: 'boolean', default: true })
  enableChat: boolean;

  @OneToMany(
    () => SubscriptionEntity,
    (subscriptionEntity: SubscriptionEntity) => subscriptionEntity.userId,
    {
      cascade: true,
    },
  )
  subscription: SubscriptionEntity;

  @OneToMany(() => CommentEntity, (commentEntity: CommentEntity) => commentEntity.userId, {
    cascade: true,
  })
  comment: CommentEntity[];

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'preferChamp1',
      referencedColumnName: 'id',
    },
  ])
  preferChamp1: ChampEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'preferChamp2',
      referencedColumnName: 'id',
    },
  ])
  preferChamp2: ChampEntity;

  @ManyToOne(() => ChampEntity, (champEntity: ChampEntity) => champEntity.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn([
    {
      name: 'preferChamp3',
      referencedColumnName: 'id',
    },
  ])
  preferChamp3: ChampEntity;

  static createUserOption(
    socialId: string,
    social: string,
    nickname: string,
    profileImg: string,
  ): UserEntity {
    const user = new UserEntity();
    user.socialId = socialId;
    user.social = social;
    user.nickname = nickname;
    user.profileImg = profileImg;
    return user;
  }
  static createSelectOption(userId: string): UserEntity {
    const user = new UserEntity();
    user.userId = userId;
    return user;
  }

  static createUpdateOption(data: {
    userId: string;
    nickname: string;
    profileImg: string;
    bio: string;
    preferPosition: string;
    tier: number;
    enableChat: boolean;
    preferChamp1: ChampEntity;
    preferChamp2: ChampEntity;
    preferChamp3: ChampEntity;
  }) {
    const option = new UserEntity();
    option.userId = data.userId;
    option.nickname = data.nickname;
    option.profileImg = data.profileImg;
    option.bio = data.bio;
    option.preferPosition = data.preferPosition;
    option.tier = data.tier;
    option.enableChat = data.enableChat;
    option.preferChamp1 = data.preferChamp1;
    option.preferChamp2 = data.preferChamp2;
    option.preferChamp3 = data.preferChamp3;
    return option;
  }
}

// constructor(socialId?: string, social?: string, nickname?: string, profileImg?: string, bio?: string, preferPosition?: string, tier?: number, enableChat?: boolean, subscription?: SubscriptionEntity, comment?: CommentEntity, preferChamp1?: ChampEntity, preferChamp2?: ChampEntity, preferChamp3?: ChampEntity, userId?: string) {
//   super();
//   this.userId = body.userId;
//   this.socialId = socialId;
//   this.social = social;
//   this.nickname = nickname;
//   this.profileImg = profileImg;
//   this.bio = bio;
//   this.preferPosition = preferPosition;
//   this.tier = tier;
//   this.enableChat = enableChat;
//   this.subscription = subscription;
//   this.comment = comment;
//   this.preferChamp1 = preferChamp1;
//   this.preferChamp2 = preferChamp2;
//   this.preferChamp3 = preferChamp3;
// }

// constructor(data?: { userId?: string; socialId?: string; social?: string; nickname?: string; profileImg?: string; bio?: string; preferPosition?: string; tier?: number; enableChat?: boolean; subscription?: SubscriptionEntity; comment?: CommentEntity; preferChamp1?: ChampEntity; preferChamp2?: ChampEntity; preferChamp3?: ChampEntity }) {
//   super();
//   this.userId = data.userId;
//   this.socialId = data.socialId;
//   this.social = data.social;
//   this.nickname = data.nickname;
//   this.profileImg = data.profileImg;
//   this.bio = data.bio;
//   this.preferPosition = data.preferPosition;
//   this.tier = data.tier;
//   this.enableChat = data.enableChat;
//   this.subscription = data.subscription;
//   this.comment = data.comment;
//   this.preferChamp1 = data.preferChamp1;
//   this.preferChamp2 = data.preferChamp2;
//   this.preferChamp3 = data.preferChamp3;
// }

// static createUserOption(socialId: string, social: string, nickname: string, profileImg: string) {
//   return new UserEntity({ socialId, social, nickname, profileImg });
// }
// static deleteUserOption(userId: string) {
//   return new UserEntity({ userId });
// }
