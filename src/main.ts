import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // class-validator 등록
  app.useGlobalFilters(new HttpExceptionFilter()); // httpException filter 등록
  app.use(
    ['/docs', 'docs-json'],
    expressBasicAuth({
      challenge: true,
      users: { [`${process.env.SWAGGER_ID}`]: `${process.env.SWAGGER_PW}` },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('carryduo')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: true, // true = 어느 곳에서나 접근 가능, true 이외에 본래는 url을 작성
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '../', 'static'), {
    prefix: '/tier',
  });

  await app.listen(process.env.PORT);
}

bootstrap();
