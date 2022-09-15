import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { Get, UseGuards, Delete, UseFilters, Param, Req } from '@nestjs/common';
import { jwtGuard } from 'src/admin/jwt/jwt.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';

@Controller('user')
@ApiTags('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  @Get()
  @UseGuards(jwtGuard)
  async getLoginUserInfo(@Req() req) {
    return this.userService.getUserInfo('login', req.user);
  }

  @ApiOperation({ summary: '설정 페이지 데이터 조회' })
  @Get('/option')
  @UseGuards(jwtGuard)
  async getLoginUserOptionInfo(@Req() req) {
    return this.userService.getUserInfo('option', req.user);
  }

  @ApiOperation({ summary: '특정 유저 정보 조회' })
  @Get('/:id')
  @UseGuards(jwtGuard)
  async getIndividualUserInfo(@Param('id') param: string, @Req() req) {
    return '로그인 유저 정보 ';
  }
}
