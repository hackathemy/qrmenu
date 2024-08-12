import { ApiProperty } from '@nestjs/swagger';
import { SellerDto } from './seller.dto';

export class ListSellersRequestQueryDto {
  @ApiProperty()
  pageOffset: string;

  @ApiProperty()
  pageLimit: string;

  @ApiProperty()
  orderBy: string;

  @ApiProperty({ required: false })
  text: string;
}

export class ListSellersResponseDto {
  @ApiProperty()
  sellers: SellerDto[];

  @ApiProperty()
  totalSize: number;
}
