import { PickType } from '@nestjs/swagger';
import { ChampBasicInfoDTO } from 'src/champ/dto/champ.response.dto';
import { ChampEntity } from 'src/champ/entities/champ.entity';
import { SummonerEntity } from '../entities/summoner.entity';

export class SummonerInfoDTO extends PickType(SummonerEntity, [
  'summonerName',
  'summonerIcon',
  'tier',
  'tierImg',
  'lp',
  'win',
  'lose',
  'winRate',
]) {
  mostChamp1: ChampBasicInfoDTO | null;
  mostChamp2: ChampBasicInfoDTO | null;
  mostChamp3: ChampBasicInfoDTO | null;
}

export type mostChampList = [];
