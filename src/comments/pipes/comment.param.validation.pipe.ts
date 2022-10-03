import {
  PipeTransform,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpException,
} from '@nestjs/common';

export class CommentCategoryPipe implements PipeTransform {
  readonly categoryOptions = ['summoner', 'champ'];
  transform(value: any) {
    if (!this.isCategoryValid(value))
      throw new HttpException(`${value} 는 평판 카테고리가 아닙니다`, 400);
    return value;
  }
  private isCategoryValid(value: any) {
    const index = this.categoryOptions.indexOf(value);
    return index !== -1;
  }
}

export class CommentTargetPipe implements PipeTransform {
  async transform(value: any) {
    if (!(await this.isTargetValid(value))) {
      throw new HttpException(`${value}는 평판 타겟이 아닙니다`, 400);
    }
    return value;
  }

  private async isTargetValid(value: any) {
    const intPipe = new ParseIntPipe();
    const uuidPipe = new ParseUUIDPipe();
    try {
      const result = await intPipe.transform(value, { type: 'param' });
      return result;
    } catch {
      try {
        const result = await uuidPipe.transform(value, { type: 'param' });
        return result;
      } catch (err) {
        return false;
      }
    }
  }
}
