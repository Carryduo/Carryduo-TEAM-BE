import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // class-traonsformer로 exclude, expose를 적용
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 아무 decorator 도 없는 어떤 property의 object를 거름
      forbidNonWhitelisted: true, // 잘못된 property의 리퀘스트 자체를 막아버림
      transform: true, // 실제 원하는 타입으로 변경해줌
    }),
  ); // class-validator 등록
  app.useGlobalFilters(new HttpExceptionFilter()); // httpException filter 등록
  app.disable('x-powered-by');

  // swagger ooptions
  const config = new DocumentBuilder()
    .setTitle('carryduo')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // prod
  let corsOptions;
  if (process.env.NODE_ENV === 'prod') {
    // cors
    corsOptions = {
      origin: [
        `${process.env.FRONT_URL_PROD}`,
        `${process.env.FRONT_URL2_PROD}`,
      ],
      credentials: true,
    };
  }
  // dev
  else if (process.env.NODE_ENV === 'dev') {
    // cors
    corsOptions = {
      origin: [
        `${process.env.FRONT_URL_DEV}`,
        `${process.env.FRONT_URL2_DEV}`,
        `${process.env.FRONT_URL_LOCAL}`,
      ],
      credentials: true,
    };

    // swagger
    SwaggerModule.setup(process.env.SWAGGER_PATH_DEV, app, document);
    app.use(
      [process.env.AUTH_PATH, process.env.SWAGGER_JSON],
      expressBasicAuth({
        challenge: true,
        users: { [`${process.env.SWAGGER_ID}`]: `${process.env.SWAGGER_PW}` },
      }),
    );
  }
  // local
  else {
    // cors
    corsOptions = {
      origin: true,
      credentials: true,
    };
    // swagger
    SwaggerModule.setup(process.env.SWAGGER_PATH_LOCAL, app, document);
  }

  app.enableCors(corsOptions);
  app.useStaticAssets(join(__dirname, '../../', 'static'), {
    prefix: '/tier',
  });

  await app.listen(process.env.PORT);
}

bootstrap();
