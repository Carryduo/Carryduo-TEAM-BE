import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentRepository } from '../comments.repository';
import { CommentsService } from '../comments.service';
import { CommentEntity } from '../entities/comments.entity';
import * as comments from './data/comments.data';

class mockRepository {}
class cacheRepository {}

describe('CommentsService', () => {
  let service: CommentsService;
  let repository: CommentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        CommentRepository,
        ConfigService,
        {
          provide: getRepositoryToken(CommentEntity),
          useClass: mockRepository,
        },
        {
          provide: CACHE_MANAGER,
          useClass: cacheRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    repository = module.get<CommentRepository>(CommentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getComments return summoner or champ comments?', async () => {
    let category = 'champ';
    let target = '86';

    jest.spyOn(repository, 'getComments').mockResolvedValue(comments.champ);
    const champComments = await service.getComments(category, target);
    expect(champComments).toEqual(comments.champ);

    category = 'summoner';
    target = '할배탈';
    jest.spyOn(repository, 'getComments').mockResolvedValue(comments.summoner);
    const summonerComments = await service.getComments(category, target);
    expect(summonerComments).toEqual(comments.summoner);
  });

  it('postComment 가 잘 실행되나?', async () => {
    const category = 'champ';
    const target = '86';
    const user = {
      userId: 'kim',
      nickname: '할배탈',
      profileImg: 'example.png',
    };
    const data = { content: '~~~' };

    jest.spyOn(repository, 'postComment').mockResolvedValue({
      success: true,
      message: '평판 업로드 완료했습니다',
    });
    const post = await service.postComment(category, target, user, data);
    expect(post).toEqual({
      success: true,
      message: '평판 업로드 완료했습니다',
    });
  });
});
