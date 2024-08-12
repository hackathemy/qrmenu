import { ApiProperty } from '@nestjs/swagger';
import { ApiPropertyResource } from 'src/common/internal/decorators/api-property.decorator';
import { SellerTranslateDto } from './seller-translate.dto';
import { LangCode } from '@hackathon-qrmenu/type';

export class GetSellerTranslateBySellerRequestParamDto {
  @ApiProperty({ description: 'Target' })
  sellerId: string;
}

export class GetSellerTranslateBySellerRequestQueryDto {
  @ApiProperty({ description: 'Target' })
  langCode: LangCode;
}

export class GetSellerTranslateBySellerResponseDto {
  @ApiPropertyResource()
  translate: SellerTranslateDto;
}
