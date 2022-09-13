import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './kakao.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { jwtStrategy } from './jwt.strategy';
import { AdminRepository } from './admin.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_EXPRIED_TIME },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, KakaoStrategy, jwtStrategy, AdminRepository],
})
export class AdminModule {}
