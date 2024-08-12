import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { ContentTranslateDto } from './content.dto';

export class PatchContentTranslateRequestParamDto {
  @ApiProperty()
  contentId: string;

  @ApiProperty()
  translateId: string;
}

export class PatchContentTranslateRequestBodyDto {
  @ApiPropertyResource()
  translate: ContentTranslateDto;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchContentTranslateyResponseDto {}
