import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/exception/http-exception.filter';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { SummonerEntity } from './../src/summoner/entities/summoner.entity';
import { SummonerHistoryEntity } from './../src/summoner/entities/summoner.history.entity';

describe('Summoner (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  jest.setTimeout(50000);

  beforeAll(async () => {
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

  it('/GET 소환사 전적 검색 DB에 없는 경우 riot 요청을 통해 DB에 저장?', async () => {
    const summonerName = encodeURIComponent('쿠바버샷추가');
    const response = await request(app.getHttpServer()).get(`/summoner/${summonerName}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.summonerName).toBe('쿠바버샷추가');
  });

  it('/GET 소환사 전적 검색 riot에 등록되어있지 않는 소환사일 경우 error?', async () => {
    const summonerName = encodeURIComponent('asdasui245y3jfnsdf;sdf13248');
    const response = await request(app.getHttpServer()).get(`/summoner/${summonerName}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('/GET 소환사 전적 갱신 DB에 없는 소환사일 경우 error?', async () => {
    const summonerName = encodeURIComponent('hide on bush');
    const response = await request(app.getHttpServer()).get(`/summoner/refresh/${summonerName}`);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('갱신할 수 없는 소환사입니다.(DB에 소환사가 없습니다.)');
  });

  it('/GET 소환사 전적 갱신 특정 소환사 갱신 후 해당 소환사 5분 안에 다시 요청시 error?', async () => {
    const summonerName = encodeURIComponent('쿠바버샷추가');
    await request(app.getHttpServer()).get(`/summoner/refresh/${summonerName}`);
    const response = await request(app.getHttpServer()).get(`/summoner/refresh/${summonerName}`);

    expect(response.statusCode).toBe(429);
    expect(response.body.message).toEqual('Too many requests');
  });

  afterAll(async () => {
    await dataSource.getRepository(SummonerEntity).createQueryBuilder().delete().where({ summonerName: '쿠바버샷추가' }).execute();

    await dataSource.getRepository(SummonerHistoryEntity).createQueryBuilder().delete().where({ summonerName: '쿠바버샷추가' }).execute();
    await app.close();
  });
});
