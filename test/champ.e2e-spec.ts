import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/exception/http-exception.filter';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { ChampEntity } from '../src/champ/entities/champ.entity';
import { UserEntity } from './../src/user/entities/user.entity';
import { plainToInstance } from 'class-transformer';

describe('Champ (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
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

    const Annie = {
      id: '1',
      champNameKo: '애니',
      champNameEn: 'Annie',
      champMainImg: 'example.png',
      champImg: 'example.png',
    };
    const AnnieToEntity = plainToInstance(ChampEntity, Annie);

    await dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        nickname: '영우',
        profileImg: 'example.png',
        preferChamp1: AnnieToEntity,
      })
      .execute();
  });

  it('/GET 챔프 리스트', async () => {
    const response = await request(app.getHttpServer()).get('/champ');
    expect(response.body.length).toBe(162);
  });

  it('/GET 선호 챔피언 유저 리스트', async () => {
    const response = await request(app.getHttpServer()).get('/champ/1/users');
    expect(response.body[0].nickname).toBe('영우');
  });

  it('/GET 타겟 챔피언 포지션 default 파라미터', async () => {
    const response = await request(app.getHttpServer()).get(
      '/champ/1/position/default',
    );
    expect(response.body.position).toBe('mid');
  });

  it('/GET 타겟 챔피언 포지션에 대한 데이터 없을시 default value return?', async () => {
    const response = await request(app.getHttpServer()).get(
      '/champ/888/position/ad',
    );
    expect(response.body.winRate).toBe(0);
    expect(response.body.pickRate).toBe(0);
  });

  it('/GET 타겟 챔피언 포지션에 대한 데이터 정상 return?', async () => {
    const response = await request(app.getHttpServer()).get(
      '/champ/888/position/support',
    );
    expect(response.body.winRate).toBe(48.3);
    expect(response.body.pickRate).toBe(1.64);
  });

  it('/GET 타겟 챔피언 포지션에 대한 파라미터 예외 처리?', async () => {
    const response = await request(app.getHttpServer()).get(
      '/champ/888/position/aaa',
    );
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual([
      'position must be one of the following values: default, top, jungle, mid, ad, support',
    ]);
  });

  afterAll(async () => {
    await dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .delete()
      .where({ nickname: '영우' })
      .execute();
    await app.close();
  });
});
