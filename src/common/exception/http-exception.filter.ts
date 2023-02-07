// 예외처리 필터
// 필터 적용은 controller 단/전역 단에서 적용 가능
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    //httpexception 객체로 전달되는 에러메시지(string/object(404에러일 경우)로 있음.)
    const error = exception.getResponse() as string | { error: string; statusCode: number; message: string | string[] };
    // type이 Object인 404 에러의 분기 처리(404에러를 포함한 에러 예외 처리)

    // 1. 404 외의 에러
    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: error,
      });
    } else {
      // 2. 404 에러
      response.status(status).json({
        success: false,
        timestamp: new Date().toISOString(),
        ...error, //비구조할당으로 객체를 풀어서 그 안의 값만 정렬
      });
    }
  }
}
