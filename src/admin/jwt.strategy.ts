import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from './dto/jwt.payload';

// jwt 생성, 검증 전략
@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //헤더에서 bearer type으로 활용
      secretOrKey: process.env.JWT_SECRET_KEY, // 시크릿 키(인증용)
      ignoreExpiration: false, // 만료 기간 지난 토큰을 허가하는지 여부
    });
  }
  // 검증 메소드: 디코딩은 모듈 자체에서 자동으로 되는 것으로 보임.
  async validate(payload: jwtPayload) {
    // const cat = await this.catsRepository.findCatById(payload.id);
    // if (cat) {
    //   return cat.readOnlyDATA; // request의 user 파라미터 안에 cat을 삽입.
    // } else {
    //   throw new UnauthorizedException('등록된 고양이가 아닙니다.');
    // }
  }
}
