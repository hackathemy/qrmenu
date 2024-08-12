import { ApiProperty } from '@nestjs/swagger';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';
import { SellerDto } from './seller.dto';

export class PatchSellerRequestParamDto {
  @ApiProperty({ description: 'Target Account' })
  sellerId: string;
}

export class PatchSellerRequestBodyDto {
  @ApiPropertyResource()
  seller: SellerDto;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchSellerResponseDto {
  @ApiPropertyResource()
  seller: SellerDto;
}
