import { LangCode } from '@hackathemy-qrmenu/type';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryTranslateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  langCode: LangCode;

  @ApiProperty()
  name: string;
}

export class CategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty({})
  isPrivate: boolean;

  @ApiProperty({})
  translate: CategoryTranslateDto;

  @ApiProperty({})
  menuTotalSize: number;
}
