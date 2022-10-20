import { CommentRepository } from './../comments/comments.repository';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './kakao.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { jwtStrategy } from './jwt/jwt.strategy';
import { AdminRepository } from './admin.repository';
import { CommentEntity } from 'src/comments/entities/comments.entity';
import { ChampRepository } from 'src/champ/champ.repository';
import { ChampModule } from 'src/champ/champ.module';
import { UserRepository } from 'src/user/user.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CommentEntity]),
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPRIED_TIME },
    }),
    ChampModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    KakaoStrategy,
    jwtStrategy,
    AdminRepository,
    UserRepository,
    CommentRepository,
  ],
  exports: [AdminRepository],
})
export class AdminModule {}
