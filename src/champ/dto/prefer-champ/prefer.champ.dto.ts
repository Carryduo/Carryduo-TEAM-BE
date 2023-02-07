import { PickType } from '@nestjs/swagger';
import { UserCommonDto } from '../../../user/dto/user.common.dto';

export class preferChampUsersDTO extends PickType(UserCommonDto, ['userId', 'nickname', 'profileImg', 'tier']) {}
