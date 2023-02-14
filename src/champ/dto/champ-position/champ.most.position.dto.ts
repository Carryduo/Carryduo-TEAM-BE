import { Transform } from 'class-transformer';

export const positionList = {
  top: 'TOP',
  jungle: 'JUNGLE',
  mid: 'MIDDLE',
  ad: 'BOTTOM',
  support: 'UTILITY',
  default: 'default position',
};

//default 파라미터에 해당 챔피언의 모스트 포지션이 없을경우 "default position"
export class GetMostPositionDto {
  @Transform(({ value }) => {
    return !value
      ? positionList.default
      : Object.keys(positionList).find((key) => positionList[key] === value);
  })
  position: string;
}
