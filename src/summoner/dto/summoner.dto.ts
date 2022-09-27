import { ApiProperty, PickType } from '@nestjs/swagger';
import { SummonerEntity } from '../entities/summoner.entity';

export class SummonerResponseDTO extends PickType(SummonerEntity, [
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

export class SummonerRequestDTO extends PickType(SummonerEntity, [
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
