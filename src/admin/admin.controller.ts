import { AdminService } from './admin.service';
import { Controller } from '@nestjs/common';
import { Get, UseGuards, Delete, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { jwtGuard } from './jwt/jwt.guard';
import { HttpExceptionFilter } from '../common/exception/http-exception.filter';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonResponseDTO } from '../common/dto/common.response.dto';
import { User } from '../common/decorators/user.decorator';
import { kakaoPayload } from './dto/kakao.payload';
import { FirstLoginResponseDto, LoginResponseDto } from './dto/admin.response.dto';
import { DeleteUserDto, FirstLoginRequestDto } from './dto/admin.request.dto';
@Controller('admin')
@ApiTags('admin')
@UseFilters(HttpExceptionFilter)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // TODO: 회원탈퇴 COMMENT 이외에 DTO, ENTITY 수정하기
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
  // TODO: LoginResponseDto 바꾸기
  async deleteUser(@User() user: LoginResponseDto) {
    return this.adminService.deleteUser(DeleteUserDto.creatDeleteUserDto(user.userId));
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
    type: FirstLoginResponseDto,
  })
  @ApiResponse({ status: 400, description: 'fail' })
  @Get('/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@User() user: kakaoPayload): Promise<FirstLoginResponseDto> {
    return this.adminService.kakaoLogin(FirstLoginRequestDto.createFristLoginRequestDto(user));
  }
}
