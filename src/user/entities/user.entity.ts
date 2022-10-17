import { OmitType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { SubscriptionEntity } from 'src/subscription/entities/subscription.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @OneToMany(
    () => CommentEntity,
    (commentEntity: CommentEntity) => commentEntity.userId,
    {
      cascade: true,
    },
  )
  comment: CommentEntity;

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
  preferChamp1: string;

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
  preferChamp2: string;

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
  preferChamp3: string;
}
