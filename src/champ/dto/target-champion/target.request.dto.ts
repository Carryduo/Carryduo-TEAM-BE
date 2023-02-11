import { IsNotEmpty, IsString } from 'class-validator';

export class TargetChampionReqDTO {
  @IsString()
  @IsNotEmpty()
  champId: string;
  @IsString()
  @IsNotEmpty()
  position: string;
}
