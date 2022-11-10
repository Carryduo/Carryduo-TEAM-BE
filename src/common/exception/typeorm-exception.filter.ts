import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    let message: string = exception.message;
    let code: number = (exception as any).code;
    const status: number = 500;

    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      code,
      message,
    });
  }
}
