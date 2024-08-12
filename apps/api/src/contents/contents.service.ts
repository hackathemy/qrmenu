import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PutContentMenusRequestBodyDto,
  PutContentMenusRequestParamDto,
} from './dtos/put-menus.dto';
import {
  PatchContentRequestBodyDto,
  PatchContentRequestParamDto,
} from './dtos/patch-content.dto';
import {
  PatchContentTranslateRequestBodyDto,
  PatchContentTranslateRequestParamDto,
} from './dtos/patch-content-translate.dto';
import { ListContentsRequestQueryDto } from './dtos/list-contents.dto';
import {
  GetContentRequestQueryDto,
  GetContentsequestParamDto,
} from './dtos/get-content.dto';
import { DeleteContentRequestParamDto } from './dtos/delete-content.dto';
import { CreateContentsRequestBodyDto } from './dtos/create-contents.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';
import { ContentMenu } from './entities/content-menu';
import { ContentTranslate } from './entities/content-translate.entity';
import { Seller } from 'src/sellers/entities/seller.entity';
import { File } from 'src/files/entities/file.entity';
import { LangCode } from '@hackathon/type';
import {
  ListMenusRequestParamDto,
  ListMenusRequestQueryDto,
} from './dtos/list-menus.dto';
import { TranslateUpdateableField, UpdateableField } from './types';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Menu } from 'src/menu/menus/entities/menu.entity';
import { MenusService } from 'src/menu/menus/menus.service';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private contentRepostiory: Repository<Content>,
    @InjectRepository(ContentMenu)
    private contentMenuRepostiory: Repository<ContentMenu>,
    @InjectRepository(ContentTranslate)
    private contentTranslateRepostiory: Repository<ContentTranslate>,
    private menusService: MenusService,
  ) {}

  async viewContent(contentId: string) {
    await this.contentRepostiory.update(
      { id: parseInt(contentId) },
      {
        views: () => 'views + 1',
      },
    );
  }

  async createContent(request: CreateContentsRequestBodyDto) {
    let content = this.contentRepostiory.create();
    content.isPin = request.isPin;
    content.isPrivate = request.isPrivate;
    content.seller = { id: request.sellerId } as Seller;
    content.thumbnail = { id: request.thumbnailFileId } as File;
    content = await this.contentRepostiory.save(content);
    await Promise.all(
      Object.values(LangCode).map((langCode) =>
        this.contentTranslateRepostiory.save({
          content,
          title: '',
          descriptionHtml: '',
          langCode,
        }),
      ),
    );

    return this.getContent({
      contentId: content.id.toString(),
      langCode: LangCode.KO,
    });
  }

  async deleteContent(request: DeleteContentRequestParamDto) {
    await this.contentRepostiory.delete(request.contentId);
  }

  async getContent(
    request: GetContentRequestQueryDto & GetContentsequestParamDto,
  ) {
    return await this.contentRepostiory
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.thumbnail', 'thumbnail')
      .leftJoinAndMapOne(
        'content.translate',
        'content.translates',
        'translate',
        'translate.langCode = :langCode',
        {
          langCode: request.langCode,
        },
      )
      .select()
      .where('content.id = :contentId', { contentId: request.contentId })
      .getOne();
  }

  async listContents(request: ListContentsRequestQueryDto) {
    return await this.contentRepostiory
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.thumbnail', 'thumbnail')
      .leftJoinAndMapOne(
        'content.translate',
        'content.translates',
        'translate',
        'translate.langCode = :langCode',
        {
          langCode: request.langCode,
        },
      )
      .select()
      .addSelect(
        (qb) =>
          qb
            .subQuery()
            .from(ContentTranslate, 'ct')
            .select(['ct.title collate "ko_KR.utf8"'])
            .where(() => 'ct.langCode = :langCodeLangCode', {
              langCodeLangCode: LangCode.KO,
            })
            .andWhere(() => 'ct.contentId = content.id'),
        'title',
      )
      .where('content.sellerId = :sellerId', { sellerId: request.sellerId })
      .andWhere(
        () => {
          if (request.isPrivate) {
            return 'content.isPrivate = :isPrivate';
          }
          return 'TRUE';
        },
        { isPrivate: request.isPrivate === '1' },
      )
      .andWhere(
        () => {
          if (request.text) {
            return 'translate.title like :text';
          }
          return 'TRUE';
        },
        { text: `%${request.text}%` },
      )
      .skip(parseInt(request.pageOffset))
      .take(parseInt(request.pageLimit))
      .orderBy('content.isPin', 'DESC')
      .addOrderBy('title', 'ASC')
      .getManyAndCount();
  }

  async patchContentTranslate(
    request: PatchContentTranslateRequestBodyDto &
      PatchContentTranslateRequestParamDto,
  ) {
    let translate = await this.contentTranslateRepostiory.findOneBy({
      id: parseInt(request.translateId),
    });

    if (!translate) {
      throw new NotFoundException();
    }

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    const update: QueryDeepPartialEntity<ContentTranslate> = {};
    const updated: { [key: string]: string } = {};

    if (updateFields.includes(TranslateUpdateableField.Title)) {
      update['title'] = request.translate.title;
      update.updatedAt = () => 'NOW()';
      updated['title'] = update['title'];
    }

    if (updateFields.includes(TranslateUpdateableField.DescriptionHtml)) {
      update['descriptionHtml'] = request.translate.descriptionHtml;
      update.updatedAt = () => 'NOW()';
      updated['descriptionHtml'] = update['descriptionHtml'];
    }

    await this.contentTranslateRepostiory.update({ id: translate.id }, update);
  }

  async patchContent(
    request: PatchContentRequestBodyDto & PatchContentRequestParamDto,
  ) {
    let content = await this.contentRepostiory.findOneBy({
      id: parseInt(request.contentId),
    });

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    if (updateFields.includes(UpdateableField.IsPin)) {
      content.isPin = request.content.isPin;
    }
    if (updateFields.includes(UpdateableField.IsPrivate)) {
      content.isPrivate = request.content.isPrivate;
    }
    if (updateFields.includes(UpdateableField.Thumbnail)) {
      content.thumbnail = { id: request.content.thumbnail.id } as File;
    }

    content = await this.contentRepostiory.save(content);

    return content;
  }

  async listMenus(
    request: ListMenusRequestParamDto & ListMenusRequestQueryDto,
  ) {
    let qb = this.contentMenuRepostiory
      .createQueryBuilder('contentMenu')
      .select()
      .leftJoinAndSelect('contentMenu.menu', 'menu');

    qb = this.menusService.defaultMenuReleations(qb, request.langCode);

    const menus = await qb
      .where('contentMenu.contentId = :contentId', {
        contentId: request.contentId,
      })
      .orderBy({ 'menu.createdAt': 'DESC' })
      .getMany();

    return menus.map((x) => x.menu);
  }

  async putMenus(
    request: PutContentMenusRequestBodyDto & PutContentMenusRequestParamDto,
  ) {
    await this.contentMenuRepostiory.delete({
      content: {
        id: parseInt(request.contentId),
      },
    });

    await Promise.all(
      request.menusIds.map((menuId) =>
        this.contentMenuRepostiory.save({
          content: {
            id: parseInt(request.contentId),
          } as Content,
          menu: {
            id: menuId,
          } as Menu,
        }),
      ),
    );
  }
}
