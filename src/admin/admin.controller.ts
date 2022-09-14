import { AdminService } from './admin.service';
import { Controller } from '@nestjs/common';
import { Get, UseGuards, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { jwtGuard } from './jwt/jwt.guard';
import { DeleteDateColumn } from 'typeorm';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/user')
  @UseGuards(jwtGuard)
  test(@Req() req) {
    return {
      message: 'test api',
      user: req.user,
    };
  }

  @Delete()
  @UseGuards(jwtGuard)
  async deleteUser(@Req() req) {
    return this.adminService.deleteUser(req.user.id);
  }
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
