import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class jwtGuard extends AuthGuard('jwt') {} // Authguard는 자동으로 passport의 strategy를 실행
