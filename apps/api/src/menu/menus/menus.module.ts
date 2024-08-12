import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuImage } from './entities/menu-image.entity';
import { MenuOptionGroup } from './entities/menu-option-group.entity';
import { MenuOptionItemTranslate } from './entities/menu-option-item-translate.entity';
import { MenuOptionItem } from './entities/menu-option-item.entity';
import { MenuTranslate } from './entities/menu-translate.entity';
import { Menu } from './entities/menu.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { MenuOptionGroupTranslate } from './entities/menu-option-group-translate.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      MenuCategory,
      MenuImage,
      MenuOptionGroupTranslate,
      MenuOptionGroup,
      MenuOptionItemTranslate,
      MenuOptionItem,
      MenuTranslate,
      Menu,
    ]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
  exports:[MenusService]
})
export class MenusModule {}
