import { ApiProperty } from '@nestjs/swagger';

export class CreateContentsRequestBodyDto {
  @ApiProperty()
  thumbnailFileId: number;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  isPin: boolean;

  @ApiProperty()
  sellerId: number;
}

export class CreateContentsResponseDto {}
