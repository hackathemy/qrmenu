import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { MenuDto } from './menu.dto';
import { LangCode } from '@hackathon/type';

export class PatchMenuRequestParamDto {
  @ApiProperty()
  menuId: string;
}

export class PatchMenuRequestBodyDto {
  @ApiPropertyResource()
  menu: MenuDto;

  @ApiProperty({ required: false })
  langCode: LangCode;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchMenuyResponseDto {}
