import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDTO {
  @ApiProperty({
    examples: [true, false],
    description: 'API 요청 성공 여부',
  })
  success: boolean;

  @ApiProperty({
    example: '000 완료되었습니다/실패하였습니다',
    description: 'API 요청 응답 메시지',
  })
  message: string;
}
