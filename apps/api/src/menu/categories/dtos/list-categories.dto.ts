import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyResource } from 'src/common/internal/decorators/api-property.decorator';
import { CategoryDto } from './category.dto';
import { LangCode } from '@hackathemy-qrmenu/type';

export class ListCategoriesRequestQueryDto {
  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  langCode: LangCode;

  @ApiProperty()
  isPrivate: undefined | null | '0' | '1';
}

export class ListCategoriesResponseDto {
  @ApiPropertyResource()
  categories: CategoryDto[];
}
