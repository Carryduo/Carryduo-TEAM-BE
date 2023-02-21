import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/common/exception/http-exception.filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  jest.setTimeout(50000);
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // 아무 decorator 도 없는 어떤 property의 object를 거름
        forbidNonWhitelisted: true, // 잘못된 property의 리퀘스트 자체를 막아버림
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter()); // httpException filter 등록
    await app.init();
    dataSource = app.get<DataSource>(DataSource); // app module에 주입되어 있는 typeorm을 변수에 할당
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('this is carryduo development server. cd test');
  });
});
