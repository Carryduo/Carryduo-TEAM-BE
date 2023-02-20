import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, HttpException, INestApplication, ValidationPipe } from '@nestjs/common';
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

  afterAll(async () => {
    await app.close();
  });

  it('/:category (GET)', async () => {
    const response_top = await request(app.getHttpServer()).get('/combination-stat/top-jungle');
    const response_mid = await request(app.getHttpServer()).get('/combination-stat/mid-jungle');
    const response_bottom = await request(app.getHttpServer()).get('/combination-stat/ad-support');

    const body_top = response_top.body;
    const body_mid = response_mid.body;
    const body_bottom = response_bottom.body;

    const status_top = response_top.statusCode;
    const status_mid = response_mid.statusCode;
    const status_bottom = response_bottom.statusCode;

    console.log(body_top);
  });

  it('/:category (GET) 예외처리 ', async () => {
    const response = await request(app.getHttpServer()).get('/combination-stat/aaa');
    const body: HttpException = response.body;
    const status = response.statusCode;
    expect(status).toBe(400);
    expect(body).toBe('aaa 는 챔피언 조합 카테고리가 아닙니다');
  });

  it('/:version (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/combination-stat/version');
    const body: HttpException = response.body;
    const status = response.statusCode;
    expect(status).toBe(200);
    console.log(body);
  });
});
