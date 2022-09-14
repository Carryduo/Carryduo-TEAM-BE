import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AdminModule } from 'src/admin/admin.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    AdminModule,
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot(),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
