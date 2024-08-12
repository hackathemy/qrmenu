import { LangCode } from '@hackathon/type';
import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from 'src/files/dtos/file.dto';

export class ContentTranslateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  descriptionHtml: string;

  @ApiProperty()
  updatedAt: Date | null;

  @ApiProperty()
  translatedAt: Date | null;

  @ApiProperty()
  langCode: LangCode;
}

export class ContentMenuDto {
  @ApiProperty()
  id: number;
}

export class ContentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  translate: ContentTranslateDto;

  @ApiProperty()
  thumbnail: FileDto;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  isPin: boolean;
}
