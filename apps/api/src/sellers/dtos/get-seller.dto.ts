import { ApiProperty } from '@nestjs/swagger';
import { SellerDto } from './seller.dto';

export class GetSellerRequestParamDto {
  @ApiProperty({})
  sellerId: string;
}

export class GetSellerResponseDto {
  @ApiProperty({})
  seller: SellerDto;
}
