import { CommentRepository } from './../comments/comments.repository';
import { AdminRepository } from './admin.repository';
import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Brackets } from 'typeorm';
import { ChampRepository } from '../champ/champ.repository';
import { UserRepository } from '../user/user.repository';
import { FirstLoginResponseDto } from './dto/admin.response.dto';
import { FirstLoginRequestDto, DeleteUserReqeustDto } from './dto/admin.request.dto';
@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository, private jwtService: JwtService, private readonly commentRepository: CommentRepository, private readonly userRepository: UserRepository, private readonly champRepository: ChampRepository) {}

  async kakaoLogin(data: FirstLoginRequestDto): Promise<FirstLoginResponseDto> {
    // 유저 검증 및 생성
    const option = data.toEntity();
    let user = await this.adminRepository.checkUser(option);
    if (user === null) {
      user = await this.adminRepository.createUser(option);
    }
    return new FirstLoginResponseDto(user.userId, user.nickname, await this.jwtService.signAsync({ sub: user.userId }, { secret: process.env.JWT_SECRET_KEY }));

    // TODO: DTO 생성 | 로그인 시 기본 정보, 감싸기
    // TODO: DTO 생성: POST, DELETE 등 RESPONSE 값
    // TODO: RESPONSE DTO 생성
    // TODO: CACHE INTERCEPTOR에 PLAIN 감싸기
  }

  // TODO: 삭제에 대한 STATUS CODE, user, comment 마무리하고 작업하기
  async deleteUser(userId: DeleteUserReqeustDto) {
    try {
      // 작성한 평판 목록 조회
      const option = userId.toEntity();
      const commentIdList = await this.adminRepository.findCommentList(option.userId);

      const cacheOptionList = [];
      // 카테고리, target, option 미리 세팅해두기
      for (const comment of commentIdList) {
        const value = await this.adminRepository.findCommentOptions(comment.id);
        const { category } = value;
        let target, option;
        if (!value.summonerName) {
          target = value.champId.id;
          option = new Brackets((qb) => {
            qb.where('comment.category = :category', { category }).andWhere('comment.champId = :champId', { champId: value.champId.id });
          });
        } else {
          target = encodeURI(String(value.summonerName.summonerName));
          option = new Brackets((qb) => {
            qb.where('comment.category = :category', { category }).andWhere('comment.summonerName = :summonerName', {
              summonerName: value.summonerName.summonerName,
            });
          });
        }
        const cacheOptions = { category, target, option };
        cacheOptionList.push(cacheOptions);
      }

      const preferchamp = await this.userRepository.findPreferchamps(option.userId);

      const preferChampList = [preferchamp.preferChamp1, preferchamp.preferChamp2, preferchamp.preferChamp3];

      for (const pcl of preferChampList) {
        if (pcl !== null) {
          await this.champRepository.delPreferChampCache(pcl);
        }
      }

      // to entity 필요
      // 유저 삭제
      await this.adminRepository.deleteUser(option);

      // 평판 목록 redis에 갱신하기
      for (const cacheOption of cacheOptionList) {
        await this.commentRepository.setCommentCache(cacheOption.category, cacheOption.target, cacheOption.option);
      }
      return { success: true, message: '회원 탈퇴 완료되었습니다' };
    } catch (error) {
      throw new HttpException('회원 탈퇴에 실패했습니다.', 400);
    }
  }
}
