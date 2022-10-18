import { AdminRepository } from './admin.repository';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { kakaoPayload } from './dto/kakao.payload';
@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private jwtService: JwtService,
  ) {}

  async kakaoLogin(data: kakaoPayload) {
    // 유저 검증 및 생성
    const user = await this.adminRepository.checkAndSignUser(data);
    return {
      id: user.userId,
      nickname: user.nickname,
      token: await this.jwtService.signAsync(
        { sub: user.userId },
        { secret: process.env.JWT_SECRET_KEY },
      ),
    };
  }

  async deleteUser(id: string) {
    return await this.adminRepository.deleteUser(id);
  }
}
