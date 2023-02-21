import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  HttpException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
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

    const body_top = response_top.body;

    const status_top = response_top.statusCode;
    expect(status_top).toBe(200);
    expect(body_top[0].category).toBe(0);
  });

  it('/:category (GET) 예외처리 ', async () => {
    const response = await request(app.getHttpServer()).get('/combination-stat/aaa');
    const body: HttpException = response.body;
    const status = response.statusCode;
    expect(status).toBe(400);
    expect(body.message).toBe('aaa 는 챔피언 조합 카테고리가 아닙니다');
  });

  it('/:category/:position (GET) | top, mid, ad', async () => {
    const response_mid = await request(app.getHttpServer()).get('/combination-stat/champ/875/mid');
    const body_mid = response_mid.body;
    expect(body_mid.length).toBe(5);

    expect(body_mid[0].mainChampId.id).toBe('875');
  });

  it('/:category/:position (GET) 예외처리1 | param: category', async () => {
    const response = await request(app.getHttpServer()).get('/combination-stat/champ/aaa/top');
    const body = response.body;
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('aaa 는 챔피언 카테고리가 아닙니다');
  });

  it('/:category/:position (GET) 예외처리1 | param: position', async () => {
    const response = await request(app.getHttpServer()).get('/combination-stat/champ/875/bbb');
    const body = response.body;
    expect(response.statusCode).toBe(400);
    expect(body.message).toBe('bbb 는 포지션 카테고리가 아닙니다');
  });
  it('/:category/:position (GET) 예외처리2 | jungle, support ', async () => {
    const response_jungle = await request(app.getHttpServer()).get(
      '/combination-stat/champ/79/jungle',
    );
    const response_support = await request(app.getHttpServer()).get(
      '/combination-stat/champ/117/support',
    );
    const body_jungle = response_jungle.body;
    const body_support = response_support.body;
    expect(body_jungle.length).toBe(5);
    expect(body_support.length).toBe(5);

    expect(body_jungle[0].mainChampId.id).toBe('79');
    expect(body_support[0].mainChampId.id).toBe('117');
  });

  it('/:category/:position (GET) 예외처리3 | no data ', async () => {
    const response = await request(app.getHttpServer()).get('/combination-stat/champ/427/ad');
    const body = response.body;
    expect(body.result).toStrictEqual([]);
    expect(body.message).toStrictEqual('유효한 데이터(표본 5 이상)가 없습니다');
  });

  it('/:version (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/combination-stat/version');
    const body = response.body;
    const status = response.statusCode;
    expect(status).toBe(200);
    expect(body.version).toBe('13.3.');
  });
});
