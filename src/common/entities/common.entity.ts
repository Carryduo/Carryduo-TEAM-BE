import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsUUID } from 'class-validator';
import { Exclude } from 'class-transformer';

export abstract class CommonEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 해당 열이 추가된 시각을 자동으로 기록
  // 만일 Postgres의 time zone이 'UTC'라면 UTC 기준으로 출력하고 'Asia/Seoul'라면 서울 기준으로 출력한다.
  // DB SQL QUERY : set time zone 'Asia/Seoul'; set time zone 'UTC'; show timezone;
  @CreateDateColumn({
    type: 'timestamp' /* timestamp with time zone */,
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Soft Delete : 기존에는 null, 삭제시에 timestamp를 찍는다.
  // exclude는 request/response에서 포함되지 않는 것을 의미.
  @Exclude()
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt?: Date | null;
}
