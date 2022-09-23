import { Get, Param, UseFilters } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { ChampService } from './champ.service';
import {
  ChampBasicInfoDTO,
  preferChampUsersDTO,
  TargetChampionResponseDTO,
} from './dto/champ.response.dto';

@Controller('champ')
@ApiTags('champ')
@UseFilters(HttpExceptionFilter)
export class ChampController {
  constructor(private readonly champService: ChampService) {}

  @Get()
  @ApiOperation({ summary: '챔피언 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '챔피언 리스트 조회 예시',
    type: ChampBasicInfoDTO,
  })
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
    description: '특정 챔피언 정보 조회 응답 예시',
    type: TargetChampionResponseDTO,
  })
  @Get('/:champId')
  async getTargetChampion(@Param('champId') champId: string) {
    return await this.champService.getTargetChampion(champId);
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
  @Get('/:champId/users')
  async getPreferChampUser(@Param('champId') champId: string) {
    return await this.champService.getPreferChampUsers(champId);
  }
}
