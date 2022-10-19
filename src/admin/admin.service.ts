import { CommentRepository } from './../comments/comments.repository';
import { AdminRepository } from './admin.repository';
import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { kakaoPayload } from './dto/kakao.payload';
import { Brackets } from 'typeorm';
@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private jwtService: JwtService,
    private readonly commentRepository: CommentRepository,
  ) {}

  async kakaoLogin(data: kakaoPayload) {
    // 유저 검증 및 생성
    const user = await this.adminRepository.checkAndSignUser(data);
    return {
      id: user.userId,
      nickname: user.nickname,
      token: await this.jwtService.signAsync(
        { sub: user.userId },
        { secret: process.env.JWT_SECRET_KEY },
      ),
    };
  }

  // TODO: 엄밀하게는 트랜젝션 걸어야함.
  async deleteUser(userId: string) {
    try {
      // 작성한 평판 목록 조회
      const commentIdList = await this.adminRepository.findCommentList(userId);

      const cacheOptionList = [];
      // 카테고리, target, option 미리 세팅해두기
      for (const comment of commentIdList) {
        const value = await this.adminRepository.findCommentOptions(comment.id);
        const { category } = value;
        let target, option;
        if (!value.summonerName) {
          target = value.champId.id;
          option = new Brackets((qb) => {
            qb.where('comment.category = :category', { category }).andWhere(
              'comment.champId = :champId',
              { champId: value.champId.id },
            );
          });
        } else {
          target = encodeURI(String(value.summonerName.summonerName));
          option = new Brackets((qb) => {
            qb.where('comment.category = :category', { category }).andWhere(
              'comment.summonerName = :summonerName',
              {
                summonerName: value.summonerName.summonerName,
              },
            );
          });
        }
        const cacheOptions = { category, target, option };
        cacheOptionList.push(cacheOptions);
      }
      // 유저 삭제
      await this.adminRepository.deleteUser(userId);

      // 평판 목록 redis에 갱신하기
      for (const cacheOption of cacheOptionList) {
        await this.commentRepository.setCommentCache(
          cacheOption.category,
          cacheOption.target,
          cacheOption.option,
        );
      }
      return { success: true, message: '회원 탈퇴 완료되었습니다' };
    } catch (error) {
      console.log(error);
      throw new HttpException('회원 탈퇴에 실패했습니다.', 400);
    }
  }
}
