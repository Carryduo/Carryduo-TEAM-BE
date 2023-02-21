import { UserService } from './user.service';
import { Controller, Post } from '@nestjs/common';
import { Get, UseGuards, UseFilters, Param, Body } from '@nestjs/common';
import { jwtGuard } from '../admin/jwt/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../common/exception/http-exception.filter';
import { GetOtherUserInfoRequestDto, UpdateUserOptionRequestBodyDto } from './dto/user.request.dto';
import { CommonResponseDto } from '../common/dto/common.response.dto';
import { User } from '../common/decorators/user.decorator';
import { LoginResponseDto } from '../admin/dto/admin.response.dto';
import { UserInfoResponseDto } from './dto/user.response.dto';

@Controller('user')
@ApiTags('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '로그인 유저 정보 조회' })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '유저 기본 정보 조회',
    type: UserInfoResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '유저 정보를 불러오지 못했습니다.',
    type: CommonResponseDto,
  })
  @Get()
  @UseGuards(jwtGuard)
  async getLoginUserInfo(@User() user: LoginResponseDto): Promise<UserInfoResponseDto> {
    return this.userService.getUserInfo(user.toGetOwnInfoRequestDto('login'));
  }

  @ApiOperation({ summary: '설정 페이지 데이터 조회' })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '설정 페이지 데이터 조회',
    type: UserInfoResponseDto,
  })
  @Get('/option')
  @UseGuards(jwtGuard)
  async getLoginUserOptionInfo(@User() user: LoginResponseDto): Promise<UserInfoResponseDto> {
    return this.userService.getUserInfo(user.toGetOwnInfoRequestDto('option'));
  }

  @ApiOperation({ summary: '설정 페이지 데이터 업데이트' })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '설정 페이지 데이터 업데이트 성공',
    type: CommonResponseDto,
  })
  @Post('/option')
  @UseGuards(jwtGuard)
  async updateUserOptionInfo(
    @User() user: LoginResponseDto,
    @Body() body: UpdateUserOptionRequestBodyDto,
  ): Promise<CommonResponseDto> {
    await this.userService.updateUserOptionInfo(user.toUpdateOptionRequestDto(body));
    return new CommonResponseDto(true, '설정 변경 완료되었습니다');
  }

  @ApiOperation({ summary: '특정 유저 정보 조회' })
  @ApiParam({
    name: 'id',
    required: true,
    description: '유저 고유 ID',
  })
  @ApiResponse({
    status: 200,
    description: '유저 상세 정보 조회',
    type: UserInfoResponseDto,
  })
  @Get('/:id')
  async getIndividualUserInfo(
    @Param() user: GetOtherUserInfoRequestDto,
  ): Promise<UserInfoResponseDto> {
    return this.userService.getUserInfo(user.toGetUserInfoRequestDto('individual'));
  }
}
