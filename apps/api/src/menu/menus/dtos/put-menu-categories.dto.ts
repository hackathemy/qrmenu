import { ApiProperty } from '@nestjs/swagger';

export class PutMenuCategoriesRequestParamDto {
  @ApiProperty()
  menuId: string;
}

export class PutMenuCategoriesRequestBodyDto {
  @ApiProperty({ isArray: true, type: Number })
  categoryIds: number[];
}

export class PutMenuCategoriesResponseDto {}
