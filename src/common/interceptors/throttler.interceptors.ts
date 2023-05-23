import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ThrottleInterceptor implements NestInterceptor {
  private readonly cache = new Map<string, number>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const summonerName = request.params.summonerName;
    const requestTime = Date.now();

    if (this.cache.has(summonerName)) {
      const lastRequestTime = this.cache.get(summonerName);

      if (requestTime - lastRequestTime < 5 * 60 * 1000) {
        throw new HttpException(
          'Too many requests',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    this.cache.set(summonerName, requestTime);

    return next.handle();
  }
}
