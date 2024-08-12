import { ApiProperty } from '@nestjs/swagger';
import { MenuDto } from './menu.dto';
import { LangCode } from '@hackathon/type';

export class ListMenusRequestQueryDto {
  @ApiProperty()
  pageOffset: string;

  @ApiProperty()
  pageLimit: string;

  @ApiProperty()
  sellerId: string;

  @ApiProperty({ required: false })
  categoryId: string | null | undefined;

  @ApiProperty()
  langCode: LangCode;
}

export class ListMenusResponseDto {
  @ApiProperty()
  menus: MenuDto[];

  @ApiProperty()
  totalSize: number;
}
