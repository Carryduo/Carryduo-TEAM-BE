import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CommonResponseDto {
  @Exclude()
  private readonly _success: boolean;

  @Exclude()
  private readonly _message: string;

  constructor(success: boolean, message: string) {
    this._success = success;
    this._message = message;
  }

  @ApiProperty({
    examples: [true, false],
    description: 'API 요청 성공 여부',
  })
  @Expose()
  get success() {
    return this._success;
  }

  @ApiProperty({
    example: '000 완료되었습니다/실패하였습니다',
    description: 'API 요청 응답 메시지',
  })
  @Expose()
  getmessage() {
    return this._message;
  }
}
