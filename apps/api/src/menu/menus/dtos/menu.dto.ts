import {
  LangCode,
  MenuAllergy,
  MenuBadge,
  MenuFoodStyle,
  MenuUnit,
} from '@hackathemy-qrmenu/type';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/menu/categories/entities/category.entity';
import { Menu } from '../entities/menu.entity';
import { FileDto } from 'src/files/dtos/file.dto';

export class MenuOptionTranslateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  langCode: LangCode;

  @ApiProperty()
  name: string;
}

export class MenuCategoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  category: Category;
}

export class MenuOptionItemDto {
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

  @ApiProperty()
  translate: MenuOptionTranslateDto;

  @ApiProperty()
  translateKR: MenuOptionTranslateDto;
}

export class MenuOptionGroupDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  isRequired: boolean;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  isFree: boolean;

  @ApiProperty()
  translate: MenuOptionTranslateDto;

  @ApiProperty()
  translateKR: MenuOptionTranslateDto;

  @ApiProperty()
  items: MenuOptionItemDto[];
}

export class MenuTranslateDto {
  @ApiProperty()
  updatedAt: Date | null;

  @ApiProperty()
  translatedAt: Date | null;

  @ApiProperty()
  id: number;

  @ApiProperty()
  langCode: LangCode;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
  @ApiProperty()
  guide: string;

  @ApiProperty()
  ingredients: string[];
}

export class MenuImageDto {
  @ApiProperty()
  image: FileDto;
}

export class MenuDto {
  @ApiProperty({ isArray: true, type: MenuImageDto })
  images: MenuImageDto[];

  @ApiProperty({ isArray: true, type: MenuCategoryDto })
  categories: MenuCategoryDto[];

  @ApiProperty({ isArray: true, type: MenuOptionGroupDto })
  optionGroups: MenuOptionGroupDto[];

  @ApiProperty()
  translate: MenuTranslateDto;

  @ApiProperty()
  translateKR: MenuTranslateDto;

  @ApiProperty()
  id: number;

  @ApiProperty({})
  isPrivate: boolean;

  @ApiProperty({})
  isSoldOut: boolean;

  @ApiProperty({ isArray: true, enum: MenuBadge, type: 'enum' })
  badges: MenuBadge[];

  @ApiProperty({ isArray: true, enum: MenuFoodStyle, type: 'enum' })
  foodStyles: MenuFoodStyle[];

  @ApiProperty({ isArray: true, enum: MenuAllergy, type: 'enum' })
  allergies: MenuAllergy[];
}
