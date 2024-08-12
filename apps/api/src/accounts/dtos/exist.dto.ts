import { ApiProperty } from '@nestjs/swagger';

export class ExistRequestBodyDto {
  @ApiProperty()
  email: string;
}
