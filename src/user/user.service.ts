import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { AdminResponse } from 'src/admin/dto/admin.response';
import { OptionRequestDTO } from './dto/user.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(category: string, data: AdminResponse) {
    return this.userRepository.getUserInfo(category, data);
  }

  async updateUserOptionInfo(data: AdminResponse, body: OptionRequestDTO) {
    return this.userRepository.updateUserOptionInfo(data, body);
  }
}
