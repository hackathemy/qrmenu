import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto, CategoryTranslateDto } from './dtos/category.dto';
import { CategoryTranslate } from './entities/category-translate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import {
  PatchCategorTranslateyRequestBodyDto,
  PatchCategorTranslateyRequestParamDto,
} from './dtos/patch-category-translate.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { TranslateUpdateableField, UpdateableField } from './types';
import { LangCode } from '@hackathon-qrmenu/type';
import { DeleteCategoryRequestParamDto } from './dtos/delete-category.dto';
import {
  PatchCategoryRequestBodyDto,
  PatchCategoryRequestParamDto,
} from './dtos/patch-category.dto';
import { CreateCategoryRequestBodyDto } from './dtos/create-category.dto';
import { Seller } from 'src/sellers/entities/seller.entity';
import { ListCategoriesRequestQueryDto } from './dtos/list-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(CategoryTranslate)
    private categoryTranslateRepository: Repository<CategoryTranslate>,
  ) {}

  mapTranslateDto(entity: CategoryTranslate): CategoryTranslateDto {
    const dto = new CategoryTranslateDto();
    dto.id = entity.id;
    dto.langCode = entity.langCode;
    dto.name = entity.name;
    return dto;
  }

  mapDto(category: Category): CategoryDto {
    const dto = new CategoryDto();
    dto.id = category.id;
    dto.isPrivate = category.isPrivate;
    dto.translate = category.translate;
    dto.menuTotalSize = category.menuTotalSize;
    return dto;
  }

  async patchTranslate(
    request: PatchCategorTranslateyRequestParamDto &
      PatchCategorTranslateyRequestBodyDto,
  ) {
    let translate = await this.categoryTranslateRepository.findOneBy({
      id: parseInt(request.translateId),
    });

    if (!translate) {
      throw new NotFoundException();
    }

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    const update: QueryDeepPartialEntity<CategoryTranslate> = {};
    const updated: { [key: string]: string } = {};

    if (updateFields.includes(TranslateUpdateableField.Name)) {
      update['name'] = request.translate.name;
      updated['name'] = update['name'];
    }

    await this.categoryTranslateRepository.update({ id: translate.id }, update);

    return await this.categoryTranslateRepository.findOneBy({
      id: parseInt(request.translateId),
    });
  }

  async patchCategoryIndex(categoryIds: number[]) {
    await Promise.all(
      categoryIds.map((id, idx) =>
        this.categoryRepository.update({ id }, { index: idx + 1 }),
      ),
    );
  }

  async listCategories(request: ListCategoriesRequestQueryDto) {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .select()
      .loadRelationCountAndMap(
        'category.menuTotalSize',
        'category.menuCategories',
        'menuTotalSize',
      )
      .leftJoinAndMapOne(
        'category.translate',
        'category.translates',
        'translate',
        'translate.langCode = :langCode',
        {
          langCode: request.langCode,
        },
      )
      .where('category.sellerId = :sellerId', { sellerId: request.sellerId })
      .andWhere((qb) => {
        if (!request.isPrivate) {
          return 'TRUE';
        }
        return `category.isPrivate is ${
          request.isPrivate === '1' ? 'TRUE' : 'FALSE'
        }`;
      })
      .orderBy('category.index', 'ASC', 'NULLS LAST')
      .getMany();
  }

  async getCategory(
    categoryId: string | number,
    langCode: LangCode = LangCode.KO,
  ) {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .select()
      .loadRelationCountAndMap(
        'category.menuTotalSize',
        'category.menuCategories',
        'menuTotalSize',
      )
      .leftJoinAndMapOne(
        'category.translate',
        'category.translates',
        'translate',
        'translate.langCode = :langCode',
        {
          langCode: langCode,
        },
      )
      .where('category.id = :id', { id: categoryId })
      .getOne();
  }

  async createCategory(request: CreateCategoryRequestBodyDto) {
    let category = this.categoryRepository.create();

    category.isPrivate = request.isPrivate;
    category.seller = { id: request.sellerId } as Seller;
    category.index =
      (await this.categoryRepository.countBy({ sellerId: request.sellerId })) +
      1;
    category = await this.categoryRepository.save(category);

    await Promise.all(
      Object.values(LangCode).map((langCode) =>
        this.categoryTranslateRepository.save({
          name: '',
          category: category,
          langCode,
        }),
      ),
    );

    return this.getCategory(category.id);
  }

  async patchCategory(
    request: PatchCategoryRequestBodyDto & PatchCategoryRequestParamDto,
  ) {
    let category = await this.categoryRepository.findOne({
      where: { id: parseInt(request.categoryId) },
    });

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    if (updateFields.includes(UpdateableField.IsPrivate)) {
      category.isPrivate = request.category.isPrivate;
    }

    category = await this.categoryRepository.save(category);

    return this.getCategory(request.categoryId, request.langCode);
  }

  async deleteCategory(request: DeleteCategoryRequestParamDto) {
    await this.categoryRepository.delete({
      id: parseInt(request.categoryId),
    });
  }
}
