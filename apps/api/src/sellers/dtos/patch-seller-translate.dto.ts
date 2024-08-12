import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { SellerTranslateDto } from './seller-translate.dto';

export class PatchSellerTranslateRequestParamDto {
  @ApiProperty({ description: 'Target' })
  sellerId: string;

  @ApiProperty({ description: 'Target' })
  translateId: string;
}

export class PatchSellerTranslateRequestBodyDto {
  @ApiPropertyResource()
  translate: SellerTranslateDto;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchSellerTranslateResponseDto {
  @ApiPropertyResource()
  translate: SellerTranslateDto;
}
