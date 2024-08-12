import { ApiProperty } from '@nestjs/swagger';
import { SellerDto } from './seller.dto';

export class GetSellerByAccountRequestParamDto {
  @ApiProperty({})
  accountId: string;
}

export class GetSellerByAccountResponseDto {
  @ApiProperty({})
  seller: SellerDto;
}
