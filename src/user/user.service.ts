import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { adminResponse } from 'src/admin/dto/admin.response';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(category: string, data: adminResponse) {
    return this.userRepository.getUserInfo(category, data);
  }
}
