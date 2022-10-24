import { UserService } from './user.service';
import { Controller, Post } from '@nestjs/common';
import {
  Get,
  UseGuards,
  UseFilters,
  Param,
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
import { User } from 'src/common/decorators/user.decorator';

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
  async getLoginUserInfo(@User() user): Promise<UserBasicInfoResponseDTO> {
    return this.userService.getUserInfo('login', user.userId);
  }

  @ApiOperation({ summary: '설정 페이지 데이터 조회' })
  @ApiBearerAuth('authorization')
  @ApiResponse({
    status: 200,
    description: '설정 페이지 데이터 조회',
    type: UserSpecificInfoResponseDTO,
  })
  @Get('/option')
  @UseGuards(jwtGuard)
  async getLoginUserOptionInfo(
    @User() user,
  ): Promise<UserSpecificInfoResponseDTO> {
    console.log('no cache here');
    return this.userService.getUserInfo('option', user.userId);
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
    @User() user,
    @Body() body: OptionRequestDTO,
  ): Promise<CommonResponseDTO> {
    return this.userService.updateUserOptionInfo(user.userId, body);
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
  async getIndividualUserInfo(
    @Param('id', ParseUUIDPipe) param: string,
  ): Promise<UserSpecificInfoResponseDTO> {
    return this.userService.getUserInfo('individual', param);
  }
}
