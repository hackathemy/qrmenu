import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import {
  PatchCategorTranslateyRequestBodyDto,
  PatchCategorTranslateyRequestParamDto,
  PatchCategorTranslateyResponseDto,
} from './dtos/patch-category-translate.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import {
  PatchCategoryRequestBodyDto,
  PatchCategoryRequestParamDto,
  PatchCategoryResponseDto,
} from './dtos/patch-category.dto';
import {
  CreateCategoryRequestBodyDto,
  CreateCategoryResponseDto,
} from './dtos/create-category.dto';
import {
  ListCategoriesRequestQueryDto,
  ListCategoriesResponseDto,
} from './dtos/list-categories.dto';
import {
  DeleteCategoryRequestParamDto,
  DeleteCategoryResponseDto,
  UpdateCategoryIndexRequestParamDto,
} from './dtos/delete-category.dto';

@Controller('/menu')
@ApiTags('Category API')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Patch('/categories/:categoryId/translate/:translateId')
  @Auth()
  @ApiOperation({ summary: '번역 수정' })
  @ApiResponse({ type: PatchCategorTranslateyResponseDto })
  async patchTranslate(
    @Param() param: PatchCategorTranslateyRequestParamDto,
    @Body() body: PatchCategorTranslateyRequestBodyDto,
    @RequestUser() requestUser,
  ): Promise<PatchCategorTranslateyResponseDto> {
    const translate = await this.categoriesService.patchTranslate({
      ...param,
      ...body,
    });

    return { translate: this.categoriesService.mapTranslateDto(translate) };
  }

  @Delete('/categories/:categoryId')
  @Auth()
  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiResponse({ type: DeleteCategoryResponseDto })
  async deleteCategory(
    @Param() param: DeleteCategoryRequestParamDto,
    @RequestUser() requestUser,
  ) {
    const category = await this.categoriesService.deleteCategory({ ...param });

    return {};
  }

  @Patch('/categories/:categoryId')
  @Auth()
  @ApiOperation({ summary: '카테고리 수정' })
  @ApiResponse({ type: PatchCategoryResponseDto })
  async patchCategory(
    @Param() param: PatchCategoryRequestParamDto,
    @Body() body: PatchCategoryRequestBodyDto,
    @RequestUser() requestUser,
  ) {
    const category = await this.categoriesService.patchCategory({
      ...param,
      ...body,
    });

    return { category: this.categoriesService.mapDto(category) };
  }

  @Post('/categories[:]index')
  @Auth()
  @ApiOperation({ summary: '카테고리 index 변경' })
  async indexCategory(@Body() body: UpdateCategoryIndexRequestParamDto) {
    return await this.categoriesService.patchCategoryIndex(body.categoryIds);
  }

  @Post('/categories')
  @Auth()
  @ApiOperation({ summary: '카테고리 등록' })
  @ApiResponse({ type: CreateCategoryResponseDto })
  async createCategory(
    @Body() body: CreateCategoryRequestBodyDto,
    @RequestUser() requestUser,
  ) {
    const category = await this.categoriesService.createCategory(body);

    return { category: this.categoriesService.mapDto(category) };
  }

  @Get('/categories')
  @ApiOperation({ summary: '카테고리 조회' })
  @ApiResponse({ type: ListCategoriesResponseDto })
  async listCategories(@Query() query: ListCategoriesRequestQueryDto) {
    const categories = await this.categoriesService.listCategories(query);

    return {
      categories: categories.map((x) => this.categoriesService.mapDto(x)),
    };
  }
}
