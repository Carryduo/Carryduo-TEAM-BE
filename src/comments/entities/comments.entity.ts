import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity({
  name: 'COMMENT',
})
export class CommentEntity extends CommonEntity {
  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  category: string;

  @Column({ type: 'varchar', nullable: false })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Column({ type: 'int', nullable: false })
  @IsNumber()
  @IsNotEmpty()
  reportNum: number;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'userId',
      referencedColumnName: 'id',
    },
  ])
  userId: UserEntity;
}
