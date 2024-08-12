import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyResource } from 'src/common/internal/decorators/api-property.decorator';
import { LangCode } from '@hackathon-qrmenu/type';
import { SellerTranslateDto } from './seller-translate.dto';

export class CreateSellerTranslateRequestParamDto {
  @ApiProperty({ description: 'Target Account' })
  sellerId: string;
}

export class CreateSellerTranslateRequestBodyDto {
  @ApiProperty()
  langCode: LangCode;
}

export class CreateSellerTranslateResponseDto {
  @ApiPropertyResource()
  translate: SellerTranslateDto;
}
