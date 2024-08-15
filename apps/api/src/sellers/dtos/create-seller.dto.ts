import { ApiProperty } from '@nestjs/swagger';
import { SellerDto } from './seller.dto';
import { SellerType } from '@hackathemy-qrmenu/type';

export class CreateSellerRequestBodyDto {
  @ApiProperty()
  visible: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contact: string;

  @ApiProperty()
  type: SellerType;

  @ApiProperty()
  managerPhoneNumber: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyNumber: string;

  @ApiProperty()
  companyNumberImageFileId: number;

  @ApiProperty()
  ceoName: string;

  @ApiProperty()
  ceoPhoneNumber: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  addressDetail: string;
}

export class CreateSellerResponseDto {
  @ApiProperty()
  seller: SellerDto;
}
