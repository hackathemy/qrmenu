import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyResource } from 'src/common/internal/decorators/api-property.decorator';
import { CategoryDto } from './category.dto';
import { LangCode } from '@hackathon/type';

export class CreateCategoryRequestBodyDto {
  @ApiProperty()
  sellerId: number;

  @ApiProperty({})
  isPrivate: boolean;
}

export class CreateCategoryResponseDto {
  @ApiPropertyResource()
  category: CategoryDto;
}
