import { ApiProperty } from '@nestjs/swagger';

export class DeleteAccountRequestParamDto {
  @ApiProperty({ description: 'Target Account' })
  accountId: string;
}

export class DeleteAccountReqeustBodyDto {
  @ApiProperty()
  password: string;
  
  @ApiProperty()
  ceoName: string;

  @ApiProperty()
  authId: number;
}

export class DeleteAccountResponseDto {}
