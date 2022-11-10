import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChampCommonDTO } from 'src/champ/dto/champ/champ.common.dto';
import { SummonerCommonDTO } from './summoner.common.dto';

export class SummonerRequestDTO extends PickType(SummonerCommonDTO, [
  'summonerName',
  'summonerId',
  'summonerIcon',
  'summonerLevel',
  'tier',
  'tierImg',
  'lp',
  'win',
  'lose',
  'winRate',
]) {
  @ApiProperty({
    description: '모스트챔피언1 정보',
  })
  mostChamp1: ChampCommonDTO | null;
  @ApiProperty({
    description: '모스트챔피언2 정보',
  })
  mostChamp2: ChampCommonDTO | null;
  @ApiProperty({
    description: '모스트챔피언3 정보',
  })
  mostChamp3: ChampCommonDTO | null;
}
