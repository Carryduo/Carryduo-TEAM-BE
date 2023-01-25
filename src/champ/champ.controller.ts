import { CacheInterceptor, Get, Param, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { TypeOrmFilter } from 'src/common/exception/typeorm-exception.filter';
import { ChampService } from './champ.service';
import { ChampDetailResponseDTO, UpdateChampDetailResponseDTO } from './dto/champ-detail/champ.detail.dto';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { preferChampUsersDTO } from './dto/prefer-champ/prefer.champ.dto';

@Controller('champ')
@ApiTags('champ')
@UseFilters(HttpExceptionFilter, TypeOrmFilter)
export class ChampController {
  constructor(private readonly champService: ChampService) {}

  @ApiOperation({ summary: '챔피언 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '챔피언 리스트 조회 예시',
    type: ChampCommonDTO,
  })
  @Get()
  async getChampionList() {
    return await this.champService.getChampList();
  }

  @ApiOperation({ summary: '특정 챔피언 정보 조회' })
  @ApiParam({
    name: 'champId',
    required: true,
    description: '조회할 챔피언의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '특정 챔피언 스킬 정보 조회 응답 예시',
    type: ChampDetailResponseDTO,
  })
  @UseInterceptors(CacheInterceptor)
  @Get('/:champId')
  async getTargetChampion(@Param('champId') champId: string) {
    return await this.champService.getTargetChampion(champId);
  }

  @ApiOperation({ summary: '특정 챔피언 정보 조회 수정본' })
  @ApiParam({
    name: 'champId',
    required: true,
    description: '조회할 챔피언의 ID',
  })
  @ApiParam({
    name: 'position',
    example: 'default ,top/ jungle/ middle/ bottom/ utility ',
    required: true,
    description: '조회할 챔피언의 position',
  })
  @ApiResponse({
    status: 200,
    description: '특정 챔피언 스킬 정보 조회 수정본 응답 예시',
    type: UpdateChampDetailResponseDTO,
  })
  @Get('/:champId/position/:position')
  async getTargetChampion2(@Param('champId') champId: string, @Param('position') position: string) {
    return await this.champService.getTargetChampion2(champId, position);
  }

  @ApiOperation({ summary: '특정 챔피언 선호한 유저 조회' })
  @ApiParam({
    name: 'champId',
    required: true,
    description: '조회할 챔피언의 ID',
  })
  @ApiResponse({
    status: 200,
    description: '특정 챔피언 선호한 유저 조회 응답 예시',
    type: preferChampUsersDTO,
  })
  @UseInterceptors(CacheInterceptor)
  @Get('/:champId/users')
  async getPreferChampUser(@Param('champId') champId: string) {
    return await this.champService.getPreferChampUsers(champId);
  }
}
