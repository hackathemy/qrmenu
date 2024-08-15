import { LangCode, MenuUnit } from '@hackathemy-qrmenu/type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuOptionItem {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  unit: MenuUnit;

  @ApiProperty()
  quantityMultiple: boolean;

  @ApiProperty()
  quantityMax: number;
}

export class CreateMenuOptionGroup {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: CreateMenuOptionItem, isArray: true })
  items: CreateMenuOptionItem[];

  @ApiProperty()
  isRequired: boolean;

  @ApiProperty()
  isDefault: boolean;
  
  @ApiProperty()
  isFree: boolean;
}

export class PutMenuOptionsRequestParamDto {
  @ApiProperty()
  menuId: string;
}

export class PutMenuOptionsRequestBodyDto {
  @ApiProperty({ type: CreateMenuOptionGroup, isArray: true })
  groups: CreateMenuOptionGroup[];

  @ApiProperty()
  langCode: LangCode;
}

export class PutMenuOptionsResponseDto {}
