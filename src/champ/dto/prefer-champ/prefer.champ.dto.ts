import { PickType } from '@nestjs/swagger';
import { UserCommonDto } from 'src/user/dto/user.common.dto';

export class preferChampUsersDTO extends PickType(UserCommonDto, [
  'id',
  'nickname',
  'profileImg',
  'tier',
]) {}
