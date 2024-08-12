import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { CategoryTranslateDto } from './category.dto';

export class PatchCategorTranslateyRequestParamDto {
  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  translateId: string;
}

export class PatchCategorTranslateyRequestBodyDto {
  @ApiPropertyResource()
  translate: CategoryTranslateDto;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchCategorTranslateyResponseDto {
  @ApiPropertyResource()
  translate: CategoryTranslateDto;
}
