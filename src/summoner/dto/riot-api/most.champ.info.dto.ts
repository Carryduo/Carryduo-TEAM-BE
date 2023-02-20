import { Exclude, Expose, Transform } from 'class-transformer';

export class MostChampDataDto {
  @Exclude()
  championPointsUntilNextLevel: number;
  @Exclude()
  chestGranted: number;
  @Exclude()
  lastPlayTime: number;
  @Exclude()
  championLevel: number;
  @Exclude()
  summonerId: string;
  @Exclude()
  championPoints: number;
  @Exclude()
  championPointsSinceLastLevel: number;
  @Exclude()
  tokensEarned: number;

  @Expose({ name: 'mostChamp1' })
  @Transform(({ value }) => {
    return value ? value : null;
  })
  mostChamp1: number;
  @Expose({ name: 'mostChamp2' })
  @Transform(({ value }) => {
    return value ? value : null;
  })
  mostChamp2: number;
  @Expose({ name: 'mostChamp3' })
  @Transform(({ value }) => {
    return value ? value : null;
  })
  mostChamp3: number;
}
