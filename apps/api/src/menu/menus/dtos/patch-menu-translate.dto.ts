import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { MenuTranslateDto } from './menu.dto';

export class PatchMenuTranslateRequestParamDto {
  @ApiProperty()
  menuId: string;

  @ApiProperty()
  translateId: string;
}

export class PatchMenuTranslateRequestBodyDto {
  @ApiPropertyResource()
  translate: MenuTranslateDto;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchMenuTranslateyResponseDto {}
