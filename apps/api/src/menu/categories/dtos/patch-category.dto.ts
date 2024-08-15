import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { CategoryDto } from './category.dto';
import { Category } from '../entities/category.entity';
import { LangCode } from '@hackathemy-qrmenu/type';

export class PatchCategoryRequestParamDto {
  @ApiProperty()
  categoryId: string;
}

export class PatchCategoryRequestBodyDto {
  @ApiPropertyResource()
  category: Category;

  @ApiPropertyResource({ required: false })
  langCode: LangCode;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchCategoryResponseDto {
  @ApiPropertyResource()
  category: Category;
}
