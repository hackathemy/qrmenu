import { LangCode } from '@hackathon/type';
import { ApiProperty } from '@nestjs/swagger';

export class SellerTranslateDto {
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  introductionHtml: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  addressDetail: string;

  @ApiProperty()
  openTimeHtml: string;

  @ApiProperty()
  langCode: LangCode;

  @ApiProperty({ required: false, nullable: true })
  introductionHtmlTranslatedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  introductionHtmlUpdatedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  openTimeHtmlTranslatedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  openTimeHtmlUpdatedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  nameTranslatedAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  nameUpdatedAt: Date | null;

  @ApiProperty()
  kidsHtml: string;
  @ApiProperty({ required: false, nullable: true })
  kidsHtmlTranslatedAt: Date | null;
  @ApiProperty({ required: false, nullable: true })
  kidsHtmlUpdatedAt: Date | null;

  @ApiProperty()
  accessibilityHtml: string;
  @ApiProperty({ required: false, nullable: true })
  accessibilityHtmlTranslatedAt: Date | null;
  @ApiProperty({ required: false, nullable: true })
  accessibilityHtmlUpdatedAt: Date | null;

  @ApiProperty()
  parkingHtml: string;
  @ApiProperty({ required: false, nullable: true })
  parkingHtmlTranslatedAt: Date | null;
  @ApiProperty({ required: false, nullable: true })
  parkingHtmlUpdatedAt: Date | null;

  @ApiProperty()
  toiletHtml: string;
  @ApiProperty({ required: false, nullable: true })
  toiletHtmlTranslatedAt: Date | null;
  @ApiProperty({ required: false, nullable: true })
  toiletHtmlUpdatedAt: Date | null;

}
