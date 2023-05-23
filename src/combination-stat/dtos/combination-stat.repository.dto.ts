import { PickType } from '@nestjs/swagger';

export class RawQueryResponseDto {
  id?: string;
  category?: number;
  sampleNum?: number;
  winrate?: number;
  opScore?: number;
  champ1_id?: string;
  champ1_champNameKo?: string;
  champ1_champNameEn?: string;
  champ1_champImg?: string;
  champ2_id?: string;
  champ2_champNameKo?: string;
  champ2_champNameEn?: string;
  champ2_champImg?: string;
  version?: string;
}

export class VersionResponseDto extends PickType(RawQueryResponseDto, [
  'version',
]) {}
