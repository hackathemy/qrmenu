import { ApiProperty } from '@nestjs/swagger';
import {
  AccountStatus,
  JoinAccount,
  JoinFile,
  PaymentCardType,
  PaymentCashType,
  PaymentSmartPayType,
  Seller,
  SellerType,
  UsageGuide,
} from '@hackathon/type';

export class JoinAccountDto implements JoinAccount {
  @ApiProperty()
  email: string;
  @ApiProperty()
  id: number;
  @ApiProperty()
  status: AccountStatus;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  createdAt: Date;
}

export class JoinFileDto implements JoinFile {
  @ApiProperty()
  id: number;
  @ApiProperty()
  size: number;
  @ApiProperty()
  fileName: string;
  @ApiProperty()
  contentType: string;
  @ApiProperty()
  key: string;
}

export class SellerDto implements Seller {
  @ApiProperty()
  id: number;

  @ApiProperty({ nullable: true })
  openTime: string | null;

  @ApiProperty({ nullable: true })
  wifiSSID: string | null;

  @ApiProperty()
  guideOrders: UsageGuide[];

  @ApiProperty({ nullable: true })
  wifiKey: string | null;

  @ApiProperty()
  visible: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  paymentCashTypes: PaymentCashType[];
  @ApiProperty()
  paymentCardTypes: PaymentCardType[];
  @ApiProperty()
  paymentSmartPayTypes: PaymentSmartPayType[];

  @ApiProperty({ nullable: true })
  enabledPayment: boolean | null;

  @ApiProperty({ nullable: true })
  enabledWifi: boolean | null;

  @ApiProperty({ nullable: true })
  enabledToilet: boolean | null;

  @ApiProperty({ nullable: true })
  enabledKids: boolean | null;

  @ApiProperty({ nullable: true })
  enabledAccessibility: boolean | null;

  @ApiProperty({ nullable: true })
  enabledParking: boolean | null;

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
  companyNumberImage: JoinFileDto;

  @ApiProperty()
  ceoName: string;

  @ApiProperty()
  ceoPhoneNumber: string;

  @ApiProperty()
  prepayment: boolean | null;

  @ApiProperty()
  address: string;

  @ApiProperty()
  addressDetail: string;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  account: JoinAccountDto;
}
