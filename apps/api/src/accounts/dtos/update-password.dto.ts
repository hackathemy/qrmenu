import { ApiProduces, ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordRequestParamDto {
  @ApiProperty()
  accountId: string;
}

export class UpdatePasswordRequestBodyDto {
  @ApiProperty({})
  password: string;
  
  @ApiProperty({})
  newPassword: string;
}

export class UpdatePasswordResponseDto {}
