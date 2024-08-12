import { ApiProperty } from '@nestjs/swagger';

export class DeleteMenuRequestParamDto {
  @ApiProperty()
  menuId: string;
}


export class DeleteMenuyResponseDto {}
