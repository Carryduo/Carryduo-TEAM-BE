import { UserService } from './user.service';
import { Controller, Post } from '@nestjs/common';
import { Get, UseGuards, UseFilters, Param, Req, Body } from '@nestjs/common';
import { jwtGuard } from 'src/admin/jwt/jwt.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { LoginResponseDTO, OptionResponseDTO } from './dto/user.response.dto';
import { OptionRequestDTO } from './dto/user.request.dto';

@Controller('user')
@ApiTags('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  @ApiResponse({
    status: 200,
    description: 'More or less dangerous animals',
    type: LoginResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: '사용자 정보를 불러오지 못했습니다.',
  })
  @Get()
  @UseGuards(jwtGuard)
  async getLoginUserInfo(@Req() req) {
    return this.userService.getUserInfo('login', req.user);
  }

  @ApiOperation({ summary: '설정 페이지 데이터 조회' })
  @ApiResponse({
    status: 200,
    description: '설정 페이지 데이터 조회',
    type: OptionResponseDTO,
  })
  // TODO: req -> user 데코레이터로 변겅
  @Get('/option')
  @UseGuards(jwtGuard)
  async getLoginUserOptionInfo(@Req() req) {
    return this.userService.getUserInfo('option', req.user);
  }

  @ApiOperation({ summary: '설정 페이지 데이터 업데이트' })
  @ApiResponse({
    status: 200,
    description: '설정 페이지 데이터 업데이트 성공',
  })
  @Post('/option')
  @UseGuards(jwtGuard)
  async updateUserOptionInfo(@Req() req, @Body() body: OptionRequestDTO) {
    return this.userService.updateUserOptionInfo(req.user, body);
  }

  @ApiOperation({ summary: '특정 유저 정보 조회' })
  @Get('/:id')
  @UseGuards(jwtGuard)
  async getIndividualUserInfo(@Param('id') param) {
    return this.userService.getIndividualUserInfo(param);
  }
}
