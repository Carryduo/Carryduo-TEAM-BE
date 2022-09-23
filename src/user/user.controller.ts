import { UserService } from './user.service';
import { Controller, Post } from '@nestjs/common';
import {
  Get,
  UseGuards,
  UseFilters,
  Param,
  Req,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { jwtGuard } from 'src/admin/jwt/jwt.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import {
  UserBasicInfoResponseDTO,
  UserSpecificInfoResponseDTO,
} from './dto/user.response.dto';
import { OptionRequestDTO } from './dto/user.request.dto';
import { CommonResponseDTO } from 'src/common/dto/common.response.dto';

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
    type: UserBasicInfoResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: '유저 정보를 불러오지 못했습니다.',
    type: CommonResponseDTO,
  })
  @Get()
  @UseGuards(jwtGuard)
  async getLoginUserInfo(@Req() req) {
    return this.userService.getUserInfo('login', req.user);
  }

  @ApiOperation({ summary: '설정 페이지 데이터 조회' })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '설정 페이지 데이터 조회',
    type: UserSpecificInfoResponseDTO,
  })
  // TODO: req -> user 데코레이터로 변겅
  @Get('/option')
  @UseGuards(jwtGuard)
  async getLoginUserOptionInfo(@Req() req) {
    return this.userService.getUserInfo('option', req.user);
  }

  @ApiOperation({ summary: '설정 페이지 데이터 업데이트' })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '설정 페이지 데이터 업데이트 성공',
    type: CommonResponseDTO,
  })
  @Post('/option')
  @UseGuards(jwtGuard)
  async updateUserOptionInfo(
    @Req() req,
    @Body() body: OptionRequestDTO,
  ): Promise<CommonResponseDTO> {
    return this.userService.updateUserOptionInfo(req.user, body);
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
    type: UserSpecificInfoResponseDTO,
  })
  @Get('/:id')
  @UseGuards(jwtGuard)
  async getIndividualUserInfo(@Param('id', ParseUUIDPipe) param: string) {
    return this.userService.getIndividualUserInfo(param);
  }
}
