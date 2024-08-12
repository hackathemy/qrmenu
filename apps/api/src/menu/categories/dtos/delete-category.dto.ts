import { ApiProperty } from '@nestjs/swagger';

export class DeleteCategoryRequestParamDto {
  @ApiProperty()
  categoryId: string;
}

export class DeleteCategoryResponseDto {}


export class UpdateCategoryIndexRequestParamDto {
  @ApiProperty()
  categoryIds: number[];
}
