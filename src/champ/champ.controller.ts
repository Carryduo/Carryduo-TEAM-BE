import { CacheInterceptor, Get, Param, UseFilters } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../common/exception/http-exception.filter';
import { TypeOrmFilter } from '../common/exception/typeorm-exception.filter';
import { ChampService } from './champ.service';
import { ChampCommonDTO } from './dto/champ/champ.common.dto';
import { PreferChampUsersDTO } from './dto/prefer-champ/prefer.champ.users.dto';
import { TargetChampionReqDTO } from './dto/target-champion/target.request.dto';
import { TargetChampionResDto } from './dto/target-champion/target.response.dto';

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
  async getChampionList(): Promise<ChampCommonDTO[]> {
    return await this.champService.getChampList();
  }

  @ApiOperation({ summary: '특정 챔피언 정보 조회' })
  @ApiParam({
    name: 'champId',
    required: true,
    description: '조회할 챔피언의 ID',
  })
  @ApiParam({
    name: 'position',
    example: 'default ,top / jungle / mid / ad / support',
    required: true,
    description: '조회할 챔피언의 position',
  })
  @ApiResponse({
    status: 200,
    description: '특정 챔피언 정보 조회 수정본 응답 예시',
    type: TargetChampionResDto,
  })
  @Get('/:champId/position/:position')
  async getTargetChampion(@Param() param: TargetChampionReqDTO) {
    return await this.champService.getTargetChampion(param);
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
    type: PreferChampUsersDTO,
  })
  // @UseInterceptors(CacheInterceptor)
  @Get('/:champId/users')
  async getPreferChampUser(
    @Param('champId') champId: string,
  ): Promise<PreferChampUsersDTO[]> {
    return await this.champService.getPreferChampUsers(champId);
  }
}
