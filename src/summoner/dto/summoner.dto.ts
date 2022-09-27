import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChampCommonDTO } from 'src/champ/dto/champ/champ.common.dto';
import { SummonerCommonDTO } from './summoner.common.dto';

class SummonerMostChamp {
  @ApiProperty({
    description: '모스트챔피언1 정보',
  })
  mostChamp1: ChampCommonDTO;
  @ApiProperty({
    description: '모스트챔피언2 정보',
  })
  mostChamp2: ChampCommonDTO;
  @ApiProperty({
    description: '모스트챔피언3 정보',
  })
  mostChamp3: ChampCommonDTO;
}

export class SummonerResponseDTO extends PickType(SummonerCommonDTO, [
  'id',
  'summonerName',
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
    description: '모스트챔피언 정보',
    isArray: true,
  })
  mostChamps: SummonerMostChamp;
}

export class SummonerRequestDTO extends PickType(SummonerCommonDTO, [
  'summonerName',
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
  mostChamp1: string | null;
  @ApiProperty({
    description: '모스트챔피언2 정보',
  })
  mostChamp2: string | null;
  @ApiProperty({
    description: '모스트챔피언3 정보',
  })
  mostChamp3: string | null;
}

export class SummonerDataCleansingDTO extends PickType(SummonerCommonDTO, [
  'id',
  'summonerName',
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
  mostChamp1: string | null;
  @ApiProperty({
    description: '모스트챔피언2 정보',
  })
  mostChamp2: string | null;
  @ApiProperty({
    description: '모스트챔피언3 정보',
  })
  mostChamp3: string | null;
}
