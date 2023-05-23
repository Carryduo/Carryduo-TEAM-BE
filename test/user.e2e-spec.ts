import { UserEntity } from './../src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/common/exception/http-exception.filter';
import { JwtService } from '@nestjs/jwt';

describe('User (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let token: string;
  let sample: UserEntity;
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
    jwtService = app.get<JwtService>(JwtService);
    // testDB에 유저 생성
    await dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values({
        nickname: `${process.env.TEST_NICKNAME}`,
        profileImg: `${process.env.TEST_IMG}`,
      })
      .execute();

    // 토큰 생성
    sample = await dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .select()
      .where({ nickname: `${process.env.TEST_NICKNAME}` })
      .getOne();

    token = await jwtService.signAsync(
      { sub: sample.userId },
      { secret: process.env.JWT_SECRET_KEY },
    );
  });

  it('/ (GET) 유저 로그인 정보 조회', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('authorization', `Bearer ${token}`);

    expect(response.body.userId).toBe(sample.userId);
  });

  it('/option (GET) 유저 로그인 옵션 조회', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/option')
      .set('authorization', `Bearer ${token}`);

    expect(Object.keys(response.body).length).toBe(9);
  });

  it('/, /option (GET) 예외처리 | 유저 토큰 에러 메시지', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('authorization', `Bearer ${token}1`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/option (POST) 유저 정보 수정', async () => {
    const response = await request(app.getHttpServer())
      .post(`/user/option`)
      .set('authorization', `Bearer ${token}`)
      .send({
        bio: null,
        enableChat: true,
        nickname: 'sample',
        preferChamp1: '875',
        preferChamp2: 85,
        preferChamp3: 23,
        preferPosition: 'su',
        profileImg: 'hello',
        tier: 4,
      });
    expect(response.body.success).toBe(true);
  });

  it('/option (POST) 예외처리 | data validation', async () => {
    const response = await request(app.getHttpServer())
      .post(`/user/option`)
      .set('authorization', `Bearer ${token}`)
      .send({
        bio: 1,
        profileImg: 'hello',
        tier: 4,
      });
    expect(response.statusCode).toBe(400);
  });

  it('/individual (GET) 다른 유저 정보 조회', async () => {
    const response = await request(app.getHttpServer()).get(
      `/user/${sample.userId}`,
    );

    expect(Object.keys(response.body).length).toBe(9);
  });

  afterAll(async () => {
    await dataSource
      .getRepository(UserEntity)
      .createQueryBuilder()
      .delete()
      .where({ userId: sample.userId })
      .execute();
    await app.close();
  });
});
