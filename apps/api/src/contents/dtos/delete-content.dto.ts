import { ApiProperty } from '@nestjs/swagger';

export class DeleteContentRequestParamDto {
  @ApiProperty()
  contentId: string;
}

export class DeleteContentResponseDto {}
