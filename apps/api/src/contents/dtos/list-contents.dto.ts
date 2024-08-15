import { ApiProperty } from '@nestjs/swagger';
import { ContentDto } from './content.dto';
import { LangCode } from '@hackathemy-qrmenu/type';

export class ListContentsRequestQueryDto {
  @ApiProperty({ required: false })
  isPrivate: '1' | '0' | null | undefined;

  @ApiProperty({ required: false })
  text: string | null;

  @ApiProperty()
  pageOffset: string;

  @ApiProperty()
  pageLimit: string;

  @ApiProperty()
  sellerId: string;

  @ApiProperty()
  langCode: LangCode;
}

export class ListContentsResponseDto {
  @ApiProperty()
  totalSize: number;

  @ApiProperty()
  contents: ContentDto[];
}
