import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ChampCommonDTO } from '../../../../champ/dto/champ/champ.common.dto';
import { SummonerCommonDTO } from '../summoner.common.dto';

export class SummonerDefaultDataDto extends OmitType(SummonerCommonDTO, [
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
  'summonerPuuId',
  'mostChamp1',
  'mostChamp2',
  'mostChamp3',
] as const) {
  @ApiProperty({
    description: '모스트 챔피언 정보',
    required: true,
    isArray: true,
    type: ChampCommonDTO,
  })
  readonly mostChamps: ChampCommonDTO[];
}
