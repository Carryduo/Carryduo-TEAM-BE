import { CommentRepository } from './comments.repository';
import { PostCommentDTO } from './dto/comment.request.dto';
import { Injectable, HttpException } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { CommentGetResponseDTO } from './dto/comment.response.dto';
import { Brackets } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async getComments(category: string, target: string): Promise<CommentGetResponseDTO[]> {
    let option;
    if (category === 'champ') {
      option = new Brackets((qb) => {
        qb.where('comment.category = :category', { category }).andWhere('comment.champId = :champId', { champId: target });
      });
    } else {
      option = new Brackets((qb) => {
        qb.where('comment.category = :category', { category }).andWhere('comment.summonerName = :summonerName', {
          summonerName: target,
        });
      });
    }
    const data = await this.commentRepository.getComments(option);
    return data;
  }

  postComment(category: string, target: string, user: AdminResponseDTO, data: PostCommentDTO) {
    let value, option;
    if (category === 'champ') {
      value = {
        userId: user.userId,
        category,
        champId: target,
        content: data.content,
      };
      option = new Brackets((qb) => {
        qb.where('comment.category = :category', { category }).andWhere('comment.champId = :champId', { champId: target });
      });
    } else {
      value = {
        userId: user.userId,
        category,
        summonerName: target,
        content: data.content,
      };
      option = new Brackets((qb) => {
        qb.where('comment.category = :category', { category }).andWhere('comment.summonerName = :summonerName', {
          summonerName: target,
        });
      });
    }
    return this.commentRepository.postComment(value, option, target);
  }

  async updateReportNum(id: string) {
    try {
      const data = await this.commentRepository.updateReportNum(id);
      const category = data.category;
      let target, option;
      if (!data.champId) {
        // interceptor??? ?????? ????????? ?????? ????????? ??????
        target = encodeURI(String(data.summonerName.summonerName));
        option = new Brackets((qb) => {
          qb.where('comment.category = :category', { category }).andWhere('comment.summonerName = :summonerName', {
            summonerName: data.summonerName.summonerName,
          });
        });
      } else {
        target = data.champId.id;
        option = new Brackets((qb) => {
          qb.where('comment.category = :category', { category }).andWhere('comment.champId = :champId', { champId: target });
        });
      }
      // ?????? ??????
      await this.commentRepository.setCommentCache(category, target, option);
      return {
        message: '?????? ?????? ?????????????????????',
        success: true,
      };
    } catch (error) {
      throw new HttpException('?????? ?????? ?????????????????????', 400);
    }
  }

  async deleteComment(id: string, userId: string) {
    try {
      const data = await this.commentRepository.deleteComment(id, userId);
      const category = data.category;
      let target, option;
      if (!data.champId) {
        // interceptor??? ?????? ????????? ?????? ????????? ??????
        target = encodeURI(String(data.summonerName.summonerName));
        option = new Brackets((qb) => {
          qb.where('comment.category = :category', { category }).andWhere('comment.summonerName = :summonerName', {
            summonerName: data.summonerName.summonerName,
          });
        });
      } else {
        target = data.champId.id;
        option = new Brackets((qb) => {
          qb.where('comment.category = :category', { category }).andWhere('comment.champId = :champId', { champId: target });
        });
      }

      // ?????? ??????
      await this.commentRepository.setCommentCache(category, target, option);

      return {
        success: true,
        message: '?????? ?????? ?????????????????????',
      };
    } catch (error) {
      throw new HttpException('?????? ?????? ?????????????????????', 400);
    }
  }

  async updateContent(id: string, userId: string, content: string) {
    try {
      const data = await this.commentRepository.updateContent(id, userId, content);
      const category = data.category;
      let target, option;
      if (!data.champId) {
        // interceptor??? ?????? ????????? ?????? ????????? ??????
        target = encodeURI(String(data.summonerName.summonerName));
        option = new Brackets((qb) => {
          qb.where('comment.category = :category', { category }).andWhere('comment.summonerName = :summonerName', {
            summonerName: data.summonerName.summonerName,
          });
        });
      } else {
        target = data.champId.id;
        option = new Brackets((qb) => {
          qb.where('comment.category = :category', { category }).andWhere('comment.champId = :champId', { champId: target });
        });
      }
      // ?????? ??????
      await this.commentRepository.setCommentCache(category, target, option);
      return {
        success: true,
        message: '?????? ?????? ?????????????????????',
      };
    } catch (err) {
      console.error(err);
      throw new HttpException('?????? ?????? ?????????????????????', 400);
    }
  }
}
