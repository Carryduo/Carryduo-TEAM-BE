import { AdminService } from './admin.service';
import { Controller } from '@nestjs/common';
import { Get, UseGuards, Delete, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Req } from '@nestjs/common';
import { jwtGuard } from './jwt/jwt.guard';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonResponseDTO } from 'src/common/dto/common.response.dto';
@Controller('admin')
@ApiTags('admin')
@UseFilters(HttpExceptionFilter)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 회원탈퇴
  @ApiOperation({ summary: '회원탈퇴' })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '회원 탈퇴 성공하였습니다',
    type: CommonResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: '회원 탈퇴 실패했습니다',
    type: CommonResponseDTO,
  })
  @Delete()
  @UseGuards(jwtGuard)
  async deleteUser(@Req() req) {
    return this.adminService.deleteUser(req.user.userId);
  }

  // 로컬용 로그인
  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoLogin() {
    return;
  }

  // 카카오 콜백
  @ApiOperation({ summary: '카카오 로그인' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: CommonResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'fail' })
  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@Req() req) {
    return this.adminService.kakaoLogin(req.user);
  }
}
