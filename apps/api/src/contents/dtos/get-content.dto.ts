import { ApiProperty } from '@nestjs/swagger';
import { ContentDto } from './content.dto';
import { LangCode } from '@hackathon/type';

export class GetContentsequestParamDto {
  @ApiProperty()
  contentId: string;
}

export class GetContentRequestQueryDto {
  @ApiProperty()
  langCode: LangCode;
}

export class GetContentResponseDto {
  @ApiProperty()
  content: ContentDto;
}
