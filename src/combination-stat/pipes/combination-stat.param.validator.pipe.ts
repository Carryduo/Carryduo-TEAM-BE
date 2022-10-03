import { PipeTransform, HttpException } from '@nestjs/common';

export class TierListParamPipe implements PipeTransform {
  readonly categoryOptions = ['top-jungle', 'mid-jungle', 'ad-support'];
  transform(value: any) {
    if (!this.isCategoryValid(value))
      throw new HttpException(
        `${value} 는 챔피언 조합 카테고리가 아닙니다`,
        400,
      );
    return value;
  }
  private isCategoryValid(value: any) {
    const index = this.categoryOptions.indexOf(value);
    return index !== -1;
  }
}

export class IndividualChampDataParamPipe implements PipeTransform {
  readonly categoryOptions = ['top', 'jungle', 'mid', 'ad', 'support'];
  transform(value: any) {
    if (!this.isCategoryValid(value))
      throw new HttpException(
        `${value} 는 챔피언 조합 카테고리가 아닙니다`,
        400,
      );
    return value;
  }
  private isCategoryValid(value: any) {
    const index = this.categoryOptions.indexOf(value);
    return index !== -1;
  }
}
