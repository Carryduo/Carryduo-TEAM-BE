import {
  PipeTransform,
  ParseIntPipe,
  ParseUUIDPipe,
  HttpException,
} from '@nestjs/common';

export class CommentParamPipe implements PipeTransform {
  readonly categoryOptions = ['champ', 'summoner'];
  intPipe = new ParseIntPipe();
  uuidPipe = new ParseUUIDPipe();
  transform(value: { category: string; target: string }) {
    return this.isParamValid(value);
  }
  private async isParamValid(value: { category: string; target: string }) {
    if (!this.isCategoryValid(value.category)) {
      throw new HttpException(
        `${value.category} 는 평판 카테고리가 아닙니다`,
        400,
      );
    } else if (value.category === 'champ') {
      try {
        await this.intPipe.transform(value.target, { type: 'param' });
      } catch {
        throw new HttpException(
          `${value.target} 는 챔피언 타겟이 아닙니다`,
          400,
        );
      }
    } else {
      if (value.target.length < 3 || value.target.length > 16) {
        throw new HttpException(
          `${value.target} 는 소환사 타겟이 아닙니다`,
          400,
        );
      }
    }
    return value;
    // category가 champ인데 target이 isNaN true면 리턴
    // category가 summoner인데 target이 3글자 미만, 16글자 초과인 경우 리턴
  }

  private isCategoryValid(value: string) {
    const index = this.categoryOptions.indexOf(value);
    return index !== -1;
  }
}

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
