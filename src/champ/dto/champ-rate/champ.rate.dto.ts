import { ApiProperty, PickType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class GetChampDataDTO {
  @Exclude() private _winRate: string | number;
  @Exclude() private _pickRate: string | number;
  @Exclude() private _spell1: number | string;
  @Exclude() private _spell2: number | string;
  @Exclude() private _version: string;
  @Exclude() private _position: string;

  @ApiProperty({
    example: 48.4522,
    description: '승률',
    required: true,
  })
  @Expose()
  get winRate() {
    return this._winRate;
  }
  set winRate(winRate: string | number) {
    this._winRate = winRate;
  }

  @ApiProperty({
    example: 8.19,
    description: '픽률',
    required: true,
  })
  @Expose()
  get pickRate() {
    return this._pickRate;
  }
  set pickRate(pickRate: string | number) {
    this._pickRate = pickRate;
  }
  @ApiProperty({
    example: 7,
    description: '첫번째 스펠id',
    required: true,
  })
  @Expose()
  get spell1() {
    return this._spell1;
  }
  set spell1(spell1: number | string) {
    this._spell1 = spell1;
  }
  @ApiProperty({
    example: 4,
    description: '두번째 스펠id',
    required: true,
  })
  @Expose()
  get spell2() {
    return this._spell2;
  }
  set spell2(spell2: number | string) {
    this._spell2 = spell2;
  }
  @ApiProperty({
    example: '13.3.',
    description: '버전 정보',
    required: true,
  })
  @Expose()
  get version() {
    return this._version;
  }
  set version(version: string) {
    this._version = version;
  }
  @ApiProperty({
    example: 'BOTTOM',
    description: '승률',
    required: true,
  })
  @Expose()
  get position() {
    return this._position;
  }
  set position(position: string) {
    this._position = position;
  }

  static tranformDto(
    champInfo: Array<{
      winRate: string;
      pickRate: string;
      spell1: number;
      spell2: number;
      version: string;
      position: string;
    }>,
  ) {
    const champData = new GetChampDataDTO();
    champData.winRate = champInfo[0]?.winRate ? Number(Number(champInfo[0].winRate).toFixed(2)) : 0;
    champData.pickRate = champInfo[0]?.pickRate
      ? Number(Number(champInfo[0].pickRate).toFixed(2))
      : 0;
    champData.spell1 = champInfo[0]?.spell1 ? champInfo[0].spell1 : 'default spell Image';
    champData.spell2 = champInfo[0]?.spell2 ? champInfo[0].spell2 : 'default spell Image';
    champData.version = champInfo[0]?.version ? champInfo[0].version : 'deafult version';
    champData.position = champInfo[0]?.position ? champInfo[0].position : 'default position';
    return champData;
  }
}
