import { CommonEntity } from '../../common/entities/common.entity';
import { Column, Entity } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity({
  name: 'SUBSCRIPTION',
})
export class SubscriptionEntity extends CommonEntity {}
