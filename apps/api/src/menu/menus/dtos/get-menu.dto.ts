import { ApiProperty } from '@nestjs/swagger';
import { MenuDto } from './menu.dto';
import { LangCode } from '@hackathemy-qrmenu/type';

export class GetMenuRequestParamDto {
  @ApiProperty()
  menuId: string;
}

export class GetMenuRequestQueryDto {
  @ApiProperty()
  langCode: LangCode;
}

export class GetMenuyResponseDto {
  @ApiProperty()
  menu: MenuDto;
}
