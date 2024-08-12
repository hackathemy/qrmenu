import { Module } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoryTranslate } from './entities/category-translate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Category, CategoryTranslate]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
