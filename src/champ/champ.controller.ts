import { Get, Param } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ChampService } from './champ.service';

@Controller('champ')
export class ChampController {
  constructor(private readonly champService: ChampService) {}

  @Get()
  async getChampionList() {
    return await this.champService.getChampList();
  }

  @Get('/:category')
  async getTargetChampion(@Param('category') category: string) {
    return await this.champService.getTargetChampion(category);
  }
}
