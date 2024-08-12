import { ApiProperty } from '@nestjs/swagger';

export class SwapMenuRequestBodyDto {
  @ApiProperty()
  data: { id: number; index: number }[];
}

export class UpdateBestMenuResponseDto {}
