import { MenuAllergy, MenuBadge, MenuFoodStyle } from '@hackathon/type';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuRequestBodyDto {
  @ApiProperty()
  sellerId: number;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  isSoldOut: boolean;

  @ApiProperty({ isArray: true, enum: MenuBadge, type: 'enum' })
  badges: MenuBadge[];

  @ApiProperty({ isArray: true, enum: MenuFoodStyle, type: 'enum' })
  foodStyles: MenuFoodStyle[];

  @ApiProperty({ isArray: true, enum: MenuAllergy, type: 'enum' })
  allergies: MenuAllergy[];
}

export class CreateMenuResponseDto {}
