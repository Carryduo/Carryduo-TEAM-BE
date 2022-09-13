import { AdminService } from './admin.service';
import { Controller } from '@nestjs/common';
import { Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    return 'this is admin api';
  }

  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req) {
    // payload dto 만들기(카카오, jwt)
    // jwt 생성하기
    return this.adminService.kakaoLogin(req.user);
  }
}
