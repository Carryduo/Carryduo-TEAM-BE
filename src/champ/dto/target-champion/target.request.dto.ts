import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class TargetChampionReqDTO {
  @IsString()
  @IsNotEmpty()
  champId: string;
  @IsString()
  @IsNotEmpty()
  @IsIn(['default', 'top', 'jungle', 'mid', 'ad', 'support'])
  position: string;
}
