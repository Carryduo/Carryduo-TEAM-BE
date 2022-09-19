import { Get, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChampService } from './champ.service';
import {
  ChampBasicInfoDTO,
  TargetChampionResponseDTO,
} from './dto/champ.response.dto';

@Controller('champ')
@ApiTags('champ')
export class ChampController {
  constructor(private readonly champService: ChampService) {}

  @Get()
  @ApiOperation({ summary: '챔피언 리스트 조회' })
  @ApiResponse({
    status: 200,
    description: '평판 조회 응답 예시',
    type: ChampBasicInfoDTO,
  })
  async getChampionList() {
    return await this.champService.getChampList();
  }

  @ApiOperation({ summary: '특정 챔피언 정보 조회' })
  @ApiResponse({
    status: 200,
    description: '평판 조회 응답 예시',
    type: TargetChampionResponseDTO,
  })
  @Get('/:category')
  async getTargetChampion(@Param('category') category: string) {
    return await this.champService.getTargetChampion(category);
  }
}
