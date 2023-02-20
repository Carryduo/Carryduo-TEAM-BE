import { Exclude, Expose, Transform } from 'class-transformer';

export class SummonerDataDto {
  @Exclude()
  accountId: string;
  @Exclude()
  revisionDate: number;

  @Expose({ name: 'id' })
  summonerId: string;

  @Expose({ name: 'puuid' })
  summonerPuuId: string;

  @Expose({ name: 'summonerLevel' })
  summonerLevel: number;

  @Transform(({ value }) => {
    return `https://ddragon.leagueoflegends.com/cdn/12.17.1/img/profileicon/${value}.png`;
  })
  @Expose({ name: 'profileIconId' })
  summonerIcon: string;

  @Expose({ name: 'name' })
  summonerName: string;
}
