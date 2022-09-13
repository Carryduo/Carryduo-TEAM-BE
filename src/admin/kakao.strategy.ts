import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { kakaoPayload } from './dto/kakao.payload';

export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      clientSecret: process.env.KAKAO_CLIENT_SECRET_KEY,
    });
  }
  async validate(accessToken, refreshToken, profile, done) {
    // 유저정보 가져오기
    // 유저정보 보내기
    console.log(profile);
    const payload: kakaoPayload = {
      socialId: `${profile.id}`,
      social: profile.provider,
      nickname: profile._json.properties.nickname,
      profileImg: profile._json.properties.profile_image,
    };

    done(null, payload);
  }
}
