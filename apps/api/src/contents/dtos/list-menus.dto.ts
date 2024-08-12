import { ApiProperty } from '@nestjs/swagger';
import { ContentMenuDto } from './content.dto';
import { LangCode } from '@hackathon/type';

export class ListMenusRequestParamDto {
  @ApiProperty()
  contentId: string;

}

export class ListMenusRequestQueryDto {
  @ApiProperty()
  langCode: LangCode;
}

export class ListMenusResponseDto {
  @ApiProperty()
  menus: ContentMenuDto;
}
