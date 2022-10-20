import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChampBasicInfoDTO } from 'src/champ/dto/champ/champ.dto';
import { SummonerHistoryResponseDTO } from '../history/history.dto';
import { SummonerCommonDTO } from './summoner.common.dto';

export class SummonerAllDataDTO extends PickType(SummonerCommonDTO, [
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
    type: ChampBasicInfoDTO,
  })
  mostChamps: ChampBasicInfoDTO[];
  @ApiProperty({
    description: '소환사 최근 전적 정보',
  })
  history: SummonerHistoryResponseDTO;
}

export class SummonerDataDTO extends PickType(SummonerCommonDTO, [
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
  mostChamps: ChampBasicInfoDTO[];
}
