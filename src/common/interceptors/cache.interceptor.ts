import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const encodeUrl = decodeURIComponent(request.originalUrl);
    return encodeUrl;
  }
}
