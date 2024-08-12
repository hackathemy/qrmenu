import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { ContentDto } from './content.dto';

export class PatchContentRequestParamDto {
  @ApiProperty()
  contentId: string;
}

export class PatchContentRequestBodyDto {
  @ApiPropertyResource()
  content: ContentDto;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchContentResponseDto {}
