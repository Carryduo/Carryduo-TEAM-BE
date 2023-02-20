import { CACHE_MANAGER, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentRepository } from '../comments.repository';
import { CommentsService } from '../comments.service';
import { DeleteCommentRequestDto, GetCommentRequestDto, PostCommentRequestDto, UpdateCommentRequestDto, UpdateReportNumRequestDto } from '../dto/comment.request.dto';
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

  // TODO: repository 모킹하기
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getComments: repository 메소드들에 적합한 parameter들을 전달하는가?', async () => {
    repository.createSelectOption = jest.fn().mockImplementation((data) => {
      return data;
    });
    repository.getComments = jest.fn().mockImplementation((requestOption) => {
      return [];
    });
    const parameter = new GetCommentRequestDto('champ', '86');
    await service.getComments(parameter);
    expect(repository.createSelectOption).toBeCalledWith(parameter.toEntity());
    expect(repository.getComments).toBeCalledWith(parameter.toEntity());
  });

  it('postComment 가 잘 실행되나?', async () => {
    const category = 'champ';
    const target = '86';
    const user = {
      userId: 'kim',
      nickname: '할배탈',
      profileImg: 'example.png',
    };
    const body = { content: '~~~' };

    repository.createSelectOption = jest.fn().mockImplementation((requestOption) => {
      return requestOption;
    });
    repository.postComment = jest.fn().mockImplementation((requestOption) => {
      return requestOption;
    });
    repository.setCommentCache = jest.fn().mockImplementation((category, target, requestOption) => {
      return;
    });
    const parameter = new PostCommentRequestDto(user.userId, category, target, body.content);
    await service.postComment(parameter);
    expect(repository.createSelectOption).toBeCalledWith(parameter.toEntity());
    expect(repository.postComment).toBeCalledWith(parameter.toEntity());
    expect(repository.setCommentCache).toBeCalledWith(parameter.category, parameter.target, parameter.toEntity());
  });

  it('updateComment가 잘 실행되나?', async () => {
    const id = '69b1852f-ba0d-438d-a568-127dc01de86f';
    const userId = 'kim';
    const content = '~~~~!';

    repository.createSelectOption = jest.fn().mockImplementation((requestOption) => {
      return requestOption;
    });
    repository.updateContent = jest.fn().mockImplementation((requestOption) => {
      return comments.champ;
    });
    repository.setCommentCache = jest.fn().mockImplementation((category, target, requestOption) => {
      return;
    });
    const parameter = new UpdateCommentRequestDto(id, userId, content);
    await service.updateContent(parameter);
    expect(repository.updateContent).toBeCalledWith(parameter.toEntity());
    try {
      await service.updateContent(new UpdateCommentRequestDto(null, null, 'asd'));
    } catch (err) {
      console.log(err);
      expect(err).toBeInstanceOf(HttpException);
    }
  });

  it('deleteComment가 잘 실행되나?', async () => {
    const id = '69b1852f-ba0d-438d-a568-127dc01de86f';
    const userId = 'kim';
    const parameter = new DeleteCommentRequestDto(id, userId);
    repository.createSelectOption = jest.fn().mockImplementation((requestOption) => {
      return requestOption;
    });
    repository.deleteComment = jest.fn().mockImplementation((requestOption) => {
      return comments.champ;
    });
    repository.setCommentCache = jest.fn().mockImplementation((category, target, requestOption) => {
      return;
    });
    await service.deleteComment(parameter);
    expect(repository.deleteComment).toBeCalledWith(parameter.toEntity());
    try {
      await service.deleteComment(new DeleteCommentRequestDto(null, null));
    } catch (err) {
      expect(HttpException).toBeCalledWith('평판 삭제 실패하였습니다', 400);
    }
  });

  it('updateReportNum이 잘 실행되나?', async () => {
    const id = '69b1852f-ba0d-438d-a568-127dc01de86f';
    const parameter = new UpdateReportNumRequestDto(id);
    repository.createSelectOption = jest.fn().mockImplementation((requestOption) => {
      return requestOption;
    });
    repository.updateReportNum = jest.fn().mockImplementation((requestOption) => {
      return comments.champ;
    });
    repository.setCommentCache = jest.fn().mockImplementation((category, target, requestOption) => {
      return;
    });
    await service.updateReportNum(parameter);
    expect(repository.updateReportNum).toBeCalledWith(parameter.toEntity());
    try {
      await service.updateReportNum(new UpdateReportNumRequestDto(null));
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
    }
  });
});
