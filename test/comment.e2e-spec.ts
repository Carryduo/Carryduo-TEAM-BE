import { UserEntity } from './../src/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from '../src/common/exception/http-exception.filter';
import { JwtService } from '@nestjs/jwt';

describe('Comment (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let token: string;
  let sample: UserEntity;
  let commentId: string;
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

  it('/:category/:target (POST) | 댓글 생성', async () => {
    const response = await request(app.getHttpServer())
      .post('/comments/champ/875')
      .set('authorization', `Bearer ${token}`)
      .send({ content: 'test' });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('/:category/:target (POST) 예외처리 | category', async () => {
    const response = await request(app.getHttpServer())
      .post('/comments/aaa/875')
      .set('authorization', `Bearer ${token}`)
      .send({ content: 'test' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('aaa 는 평판 카테고리가 아닙니다');
  });

  it('/:category/:target (POST) 예외처리 | target(champ)', async () => {
    const response = await request(app.getHttpServer())
      .post('/comments/champ/aaa')
      .set('authorization', `Bearer ${token}`)
      .send({ content: 'test' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('aaa 는 챔피언 타겟이 아닙니다');
  });

  it('/:category/:target (POST) 예외처리 | target(summoner)', async () => {
    const response = await request(app.getHttpServer())
      .post('/comments/summoner/a')
      .set('authorization', `Bearer ${token}`)
      .send({ content: 'test' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('a 는 소환사 타겟이 아닙니다');
  });

  it('/:categry/:target (GET) | 댓글 조회', async () => {
    const response = await request(app.getHttpServer()).get('/comments/champ/875');
    expect(response.body.length).toBe(1);
    expect(response.body[0].champId.id).toBe('875');
    expect(response.body[0].userId.nickname).toBe(sample.nickname);
    commentId = response.body[0].id;
  });

  it('/:id (Patch) | 댓글 수정', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/comments/${commentId}`)
      .set('authorization', `Bearer ${token}`)
      .send({ content: 'fix' });
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('/report/:id (Patch) | 댓글 신고 ', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/comments/report/${commentId}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('/:categry/:target (GET) | 댓글 수정, 삭제 확인', async () => {
    const response = await request(app.getHttpServer()).get('/comments/champ/875');
    expect(response.body.length).toBe(1);
    expect(response.body[0].champId.id).toBe('875');
    expect(response.body[0].userId.nickname).toBe(sample.nickname);
    expect(response.body[0].content).toBe('fix');
    expect(response.body[0].reportNum).toBe(1);
  });

  it('/:id (DELETE) | 댓글 삭제', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
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
