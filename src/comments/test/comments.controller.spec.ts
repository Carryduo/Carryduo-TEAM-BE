import { CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsController } from '../comments.controller';
import { CommentRepository } from '../comments.repository';
import { CommentsService } from '../comments.service';
import { CommentEntity } from '../entities/comments.entity';
class mockRepository {}
class cacheRepository {}
describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
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

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
