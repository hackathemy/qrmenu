import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { CreateMenuRequestBodyDto } from './dtos/create-menu.dto';
import { DeleteMenuRequestParamDto } from './dtos/delete-menu.dto';
import {
  PatchMenuRequestBodyDto,
  PatchMenuRequestParamDto,
} from './dtos/patch-menu.dto';
import {
  GetMenuRequestParamDto,
  GetMenuRequestQueryDto,
} from './dtos/get-menu.dto';
import { ListMenusRequestQueryDto } from './dtos/list-menus.dto';
import {
  PatchMenuTranslateRequestBodyDto,
  PatchMenuTranslateRequestParamDto,
} from './dtos/patch-menu-translate.dto';
import {
  PutMenuCategoriesRequestBodyDto,
  PutMenuCategoriesRequestParamDto,
} from './dtos/put-menu-categories.dto';
import {
  PutMenuImagesRequestBodyDto,
  PutMenuImagesRequestParamDto,
} from './dtos/put-menu-images.dto';
import {
  PutMenuOptionsRequestBodyDto,
  PutMenuOptionsRequestParamDto,
} from './dtos/put-menu-options.dto';
import { MenuCategory } from './entities/menu-category.entity';
import { MenuOptionGroupTranslate } from './entities/menu-option-group-translate.entity';
import { MenuImage } from './entities/menu-image.entity';
import { MenuOptionGroup } from './entities/menu-option-group.entity';
import { MenuOptionItemTranslate } from './entities/menu-option-item-translate.entity';
import { MenuOptionItem } from './entities/menu-option-item.entity';
import { MenuTranslate } from './entities/menu-translate.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { TranslateUpdateableField, UpdateableField } from './types';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { LangCode } from '@hackathon/type';
import { Category } from '../categories/entities/category.entity';
import { File } from 'src/files/entities/file.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,

    @InjectRepository(MenuCategory)
    private menuCategoryRepository: Repository<MenuCategory>,

    @InjectRepository(MenuImage)
    private menuImageRepository: Repository<MenuImage>,

    @InjectRepository(MenuTranslate)
    private menuTranslateRepository: Repository<MenuTranslate>,

    private dataSource: DataSource,
  ) {}

  async createMenu(request: CreateMenuRequestBodyDto) {
    let menu = this.menuRepository.create();
    menu.allergies = request.allergies;
    menu.badges = request.badges;
    menu.foodStyles = request.foodStyles;
    menu.isPrivate = request.isPrivate;
    menu.isSoldOut = request.isSoldOut;
    menu.seller = { id: request.sellerId } as Seller;

    menu = await this.menuRepository.save(menu);

    await Promise.all(
      Object.values(LangCode).map((langCode) =>
        this.menuTranslateRepository.save({
          menu,
          name: '',
          description: '',
          guide: '',
          ingredients: [],
          langCode,
        }),
      ),
    );

    return this.getMenu({ menuId: String(menu.id), langCode: LangCode.KO });
  }

  async deleteMenu(request: DeleteMenuRequestParamDto) {
    await this.menuRepository.delete({
      id: parseInt(request.menuId),
    });
  }

  async patchMenu(request: PatchMenuRequestBodyDto & PatchMenuRequestParamDto) {
    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    const menuUpdate: QueryDeepPartialEntity<Menu> = {};

    if (updateFields.includes(UpdateableField.IsSoldOut)) {
      menuUpdate.isSoldOut = request.menu.isSoldOut;
    }
    if (updateFields.includes(UpdateableField.IsPrivate)) {
      menuUpdate.isPrivate = request.menu.isPrivate;
    }

    if (updateFields.includes(UpdateableField.Allergies)) {
      menuUpdate.allergies = request.menu.allergies;
    }

    if (updateFields.includes(UpdateableField.Badges)) {
      menuUpdate.badges = request.menu.badges;
    }

    if (updateFields.includes(UpdateableField.FoodStyles)) {
      menuUpdate.foodStyles = request.menu.foodStyles;
    }

    await this.menuRepository.update(
      { id: parseInt(request.menuId) },
      menuUpdate,
    );

    return this.getMenu({
      menuId: String(request.menuId),
      langCode: request.langCode || LangCode.KO,
    });
  }

  async patchTranslate(
    request: PatchMenuTranslateRequestBodyDto &
      PatchMenuTranslateRequestParamDto,
  ) {
    let translate = await this.menuTranslateRepository.findOneBy({
      id: parseInt(request.translateId),
    });

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    const update: QueryDeepPartialEntity<MenuTranslate> = {};
    const updated: { [key: string]: string | string[] } = {};

    if (updateFields.includes(TranslateUpdateableField.Description)) {
      update['description'] = request.translate.description;
      updated['description'] = update['description'];
    }
    if (updateFields.includes(TranslateUpdateableField.Guide)) {
      update['guide'] = request.translate.guide;
      updated['guide'] = update['guide'];
    }
    if (updateFields.includes(TranslateUpdateableField.Ingredients)) {
      update['ingredients'] = request.translate.ingredients;
      updated['ingredients'] = update['ingredients'];
    }

    if (updateFields.includes(TranslateUpdateableField.Name)) {
      update['name'] = request.translate.name;
      updated['name'] = update['name'];
    }

    update.updatedAt = () => 'NOW()';

    await this.menuTranslateRepository.update({ id: translate.id }, update);
  }

  async putCategories(
    request: PutMenuCategoriesRequestBodyDto & PutMenuCategoriesRequestParamDto,
  ) {
    const categories = await this.menuCategoryRepository.find({
      where: {
        menu: { id: parseInt(request.menuId) },
      },
    });

    await this.menuCategoryRepository.delete({
      menu: { id: parseInt(request.menuId) },
    });

    await Promise.all(
      request.categoryIds.map((x) =>
        this.menuCategoryRepository.save({
          category: { id: x } as Category,
          menu: { id: parseInt(request.menuId) } as Menu,
          index: categories.find((z) => z.categoryId === x)?.index || null,
        }),
      ),
    );
  }

  async putImages(
    request: PutMenuImagesRequestBodyDto & PutMenuImagesRequestParamDto,
  ) {
    await this.menuImageRepository.delete({
      menu: { id: parseInt(request.menuId) },
    });

    await Promise.all(
      request.imageFileIds.map((x, i) =>
        this.menuImageRepository.save({
          image: { id: x } as File,
          menu: { id: parseInt(request.menuId) } as Menu,
          index: i,
        }),
      ),
    );
  }

  async putOptions(
    request: PutMenuOptionsRequestBodyDto & PutMenuOptionsRequestParamDto,
  ) {
    const menu = { id: parseInt(request.menuId) };

    const qr = this.dataSource.createQueryRunner();

    await qr.connect();

    await qr.startTransaction();

    const existGroups = await qr.manager.findBy(MenuOptionGroup, { menu });

    const deletedGroups = existGroups.filter(
      (x) => request.groups.findIndex((z: any) => z.id === x.id) < 0,
    );

    try {
      if (deletedGroups.length) {
        await qr.manager
          .createQueryBuilder()
          .delete()
          .from(MenuOptionGroup)
          .where('id IN (:...ids)', { ids: deletedGroups.map((x) => x.id) })
          .execute();
      }

      request.groups = await Promise.all(
        request.groups.map(async (group: any, gi) => {
          let groupEntity: MenuOptionGroup;

          if (group.id) {
            groupEntity = await qr.manager.findOneBy(MenuOptionGroup, {
              id: group.id,
            });

            groupEntity.isFree = group.isFree;
            groupEntity.isRequired = group.isRequired;
            groupEntity.index = gi + 1;
            groupEntity.isDefault = group.isDefault;
            groupEntity = await qr.manager.save(MenuOptionGroup, groupEntity);
          } else {
            groupEntity = await qr.manager.save(MenuOptionGroup, {
              isFree: group.isFree,
              isRequired: group.isRequired,
              index: gi + 1,
              isDefault: group.isDefault,
              menu,
            });
            // 첫 생성이면 번역시트 초기화
            await Promise.all(
              Object.values(LangCode).map((langCode) =>
                qr.manager.save(MenuOptionGroupTranslate, {
                  group: groupEntity,
                  name: request.langCode === langCode ? group.name : '',
                  langCode,
                }),
              ),
            );
          }

          await qr.manager.update(
            MenuOptionGroupTranslate,
            { group: groupEntity, langCode: request.langCode },
            {
              name: group.name,
            },
          );

          const existItems = await qr.manager.findBy(MenuOptionItem, {
            group: { id: groupEntity.id },
          });

          const deletedItems = existItems.filter(
            (x) => group.items.findIndex((z: any) => z.id === x.id) < 0,
          );

          if (deletedItems.length) {
            await qr.manager
              .createQueryBuilder()
              .delete()
              .from(MenuOptionItem)
              .where('id IN (:...ids)', { ids: deletedItems.map((x) => x.id) })
              .execute();
          }

          group.items = await Promise.all(
            Object.values(group.items).map(async (item: any, index) => {
              let itemEntity: MenuOptionItem;
              if (item.id) {
                itemEntity = await qr.manager.findOneBy(MenuOptionItem, {
                  id: item.id,
                });

                itemEntity.price = item.price;
                itemEntity.quantityMax = item.quantityMax;
                itemEntity.quantityMultiple = item.quantityMultiple;
                itemEntity.unit = item.unit;
                itemEntity.weight = item.weight;
                itemEntity.index = index + 1;

                itemEntity = await qr.manager.save(MenuOptionItem, itemEntity);
              } else {
                itemEntity = await qr.manager.save(MenuOptionItem, {
                  price: item.price,
                  quantityMax: item.quantityMax,
                  quantityMultiple: item.quantityMultiple,
                  unit: item.unit,
                  weight: item.weight,
                  group: groupEntity,
                  index: index + 1,
                });

                await Promise.all(
                  Object.values(LangCode).map((langCode) =>
                    qr.manager.save(MenuOptionItemTranslate, {
                      item: itemEntity,
                      name: request.langCode === langCode ? item.name : '',
                      langCode,
                    }),
                  ),
                );
              }

              await qr.manager.update(
                MenuOptionItemTranslate,
                { item: itemEntity, langCode: request.langCode },
                {
                  name: item.name,
                },
              );

              return { ...item, id: itemEntity.id };
            }),
          );

          return { ...group, id: groupEntity.id };
        }),
      );

      await qr.commitTransaction();
      await qr.release();
    } catch (error: unknown) {
      console.error(error);
      await qr.rollbackTransaction();
      await qr.release();
      throw error;
    }
  }

  async getMenu(request: GetMenuRequestParamDto & GetMenuRequestQueryDto) {
    const a = await this.defaultMenuReleations(
      this.menuRepository.createQueryBuilder('menu').select(),
      request.langCode,
    )
      .where('menu.id = :menuId', { menuId: request.menuId })
      .getOne();

    return a;
  }

  defaultMenuReleations(qb: SelectQueryBuilder<any>, langCode: LangCode) {
    return qb
      .leftJoinAndMapOne(
        'menu.translate',
        'menu.translates',
        'translate',
        'translate.langCode = :langCode',
        {
          langCode: langCode,
        },
      )
      .leftJoinAndMapOne(
        'menu.translateKR',
        'menu.translates',
        'translateKR',
        'translateKR.langCode = :langCode2',
        {
          langCode2: LangCode.KO,
        },
      )
      .leftJoinAndMapMany('menu.images', 'menu.images', 'images')
      .leftJoinAndSelect('images.image', 'image')
      .leftJoinAndMapMany(
        'menu.optionGroups',
        'menu.optionGroups',
        'optionGroups',
      )
      .leftJoinAndMapMany('menu.categories', 'menu.categories', 'categories')
      .leftJoinAndSelect('categories.category', 'category')
      .leftJoinAndMapOne(
        'optionGroups.translate',
        'optionGroups.translates',
        'optionGroupsTranslate',
        'optionGroupsTranslate.langCode = :groupLangCode',
        {
          groupLangCode: langCode,
        },
      )
      .leftJoinAndMapOne(
        'optionGroups.translateKR',
        'optionGroups.translates',
        'optionGroupsTranslateKR',
        'optionGroupsTranslateKR.langCode = :groupLangCode2',
        {
          groupLangCode2: LangCode.KO,
        },
      )

      .leftJoinAndMapMany('optionGroups.items', 'optionGroups.items', 'items')
      .orderBy({ ['items.index']: 'ASC', ['optionGroups.index']: 'ASC' })
      .leftJoinAndMapOne(
        'items.translate',
        'items.translates',
        'itemsTranslate',
        'itemsTranslate.langCode = :itemLangCode',
        {
          itemLangCode: langCode,
        },
      )
      .leftJoinAndMapOne(
        'items.translateKR',
        'items.translates',
        'itemsTranslateKR',
        'itemsTranslateKR.langCode = :itemLangCode2',
        {
          itemLangCode2: LangCode.KO,
        },
      );
  }

  async swap(data: { id: number; index: number }[]) {
    await Promise.all(
      data.map((x) =>
        this.menuCategoryRepository.update({ id: x.id }, { index: x.index }),
      ),
    );
  }

  async listMenus(request: ListMenusRequestQueryDto): Promise<[any[], number]> {
    if (request.categoryId) {
      let qb = this.menuCategoryRepository
        .createQueryBuilder('menuCategory')
        .select()
        .leftJoinAndSelect('menuCategory.menu', 'menu');

      qb = this.defaultMenuReleations(qb, request.langCode);

      const [menus, totalSize] = await qb
        .where('menuCategory.categoryId = :categoryId', {
          categoryId: request.categoryId,
        })
        .andWhere('menu.sellerId = :sellerId', { sellerId: request.sellerId })
        .skip(parseInt(request.pageOffset))
        .take(parseInt(request.pageLimit))
        .addOrderBy('menuCategory.index', 'ASC', 'NULLS LAST')
        .getManyAndCount();

      const results: any[] = menus.map((x) => ({
        ...x.menu,
        cat: { id: x.id, index: x.index },
      }));

      return [results, totalSize];
    }

    return await this.defaultMenuReleations(
      this.menuRepository.createQueryBuilder('menu').select(),
      request.langCode,
    )
      .where('menu.sellerId = :sellerId', { sellerId: request.sellerId })
      .skip(parseInt(request.pageOffset))
      .take(parseInt(request.pageLimit))
      .orderBy({ 'menu.createdAt': 'DESC' })
      .getManyAndCount();
  }
}
