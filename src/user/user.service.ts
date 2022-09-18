import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import { AdminResponseDTO } from 'src/admin/dto/admin.response';
import { OptionRequestDTO } from './dto/user.request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserInfo(category: string, data: AdminResponseDTO) {
    return this.userRepository.getUserInfo(category, data);
  }

  async updateUserOptionInfo(data: AdminResponseDTO, body: OptionRequestDTO) {
    return this.userRepository.updateUserOptionInfo(data, body);
  }

  async getIndividualUserInfo(data: string) {
    return this.userRepository.getIndividualUserInfo(data);
  }
}
