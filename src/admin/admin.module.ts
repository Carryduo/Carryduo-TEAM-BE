import { CommentRepository } from './../comments/comments.repository';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './kakao.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { jwtStrategy } from './jwt/jwt.strategy';
import { AdminRepository } from './admin.repository';
import { CommentEntity } from '../comments/entities/comments.entity';
import { ChampModule } from '../champ/champ.module';
import { UserRepository } from '../user/user.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CommentEntity]),
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPRIED_TIME }, // 만료시간
    }),
    ChampModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, KakaoStrategy, jwtStrategy, AdminRepository, UserRepository, CommentRepository],
  exports: [AdminRepository],
})
export class AdminModule {}
