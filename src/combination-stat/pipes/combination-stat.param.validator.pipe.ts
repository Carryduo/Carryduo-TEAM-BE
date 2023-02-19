import { PipeTransform, HttpException, ParseIntPipe } from '@nestjs/common';

export class CategoryParamPipe implements PipeTransform {
  readonly categoryOptions = ['top-jungle', 'mid-jungle', 'ad-support'];
  transform(value: { category: string }) {
    if (!this.isCategoryValid(value.category)) throw new HttpException(`${value.category} 는 챔피언 조합 카테고리가 아닙니다`, 400);
    return value;
  }
  private isCategoryValid(value: any) {
    const index = this.categoryOptions.indexOf(value);
    return index !== -1;
  }
}

export class IndividualChampParamPipe implements PipeTransform {
  intPipe = new ParseIntPipe();
  readonly categoryOptions = ['top', 'jungle', 'mid', 'ad', 'support'];
  async transform(value: { category: string; position: string }) {
    if (!this.isCategoryValid(value.position)) throw new HttpException(`${value.position} 는 포지션 카테고리가 아닙니다`, 400);
    if (!(await this.intPipe.transform(value.category, { type: 'param' }))) throw new HttpException(`${value.category} 는 챔피언 카테고리가 아닙니다`, 400);
    return value;
  }
  private isCategoryValid(value: any) {
    const index = this.categoryOptions.indexOf(value);
    return index !== -1;
  }
}
