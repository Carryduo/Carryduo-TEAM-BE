import { AdminService } from './admin.service';
import { Controller } from '@nestjs/common';
import { Get, UseGuards, Delete, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { jwtGuard } from './jwt/jwt.guard';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('admin')
@ApiTags('admin')
@UseFilters(HttpExceptionFilter)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: '회원탈퇴' })
  @ApiResponse({ status: 200, description: '회원 탈퇴 성공하였습니다' })
  @ApiResponse({ status: 400, description: '회원 탈퇴 실패했습니다' })
  @Delete()
  @UseGuards(jwtGuard)
  async deleteUser(@Req() req) {
    return this.adminService.deleteUser(req.user.id);
  }

  // 프론트 통신 시 삭제 예정
  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoLogin() {
    return 'this is admin api';
  }

  // 카카오 콜백
  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @ApiResponse({ status: 400, description: 'fail' })
  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req) {
    // payload dto 만들기(카카오, jwt)
    // jwt 생성하기
    return this.adminService.kakaoLogin(req.user);
  }
}
