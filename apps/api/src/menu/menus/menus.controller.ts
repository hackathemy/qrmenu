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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateMenuRequestBodyDto } from './dtos/create-menu.dto';
import { DeleteMenuRequestParamDto } from './dtos/delete-menu.dto';
import {
  GetMenuRequestParamDto,
  GetMenuRequestQueryDto,
  GetMenuyResponseDto,
} from './dtos/get-menu.dto';
import {
  PatchMenuRequestBodyDto,
  PatchMenuRequestParamDto,
} from './dtos/patch-menu.dto';
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
import { MenusService } from './menus.service';
import {
  SwapMenuRequestBodyDto,
} from './dtos/update-best.dto';
import {
  ListMenusRequestQueryDto,
  ListMenusResponseDto,
} from './dtos/list-menus.dto';

@Controller('/menu')
@ApiTags('Menu API')
export class MenusController {
  constructor(private menusService: MenusService) {}

  @Post('/menu_categories[:]swap')
  @Auth()
  @ApiOperation({ summary: 'Swap' })
  async swap(@Body() body: SwapMenuRequestBodyDto) {
    return this.menusService.swap(body.data);
  }



  @Put('/menus/:menuId/categories')
  @Auth()
  @ApiOperation({ summary: 'Put Menu Categories' })
  async putMenuCagrgories(
    @Param() param: PutMenuCategoriesRequestParamDto,
    @Body() body: PutMenuCategoriesRequestBodyDto,
  ) {
    return this.menusService.putCategories({ ...param, ...body });
  }

  @Put('/menus/:menuId/images')
  @Auth()
  @ApiOperation({ summary: 'Put Menu Images' })
  async putMenuImages(
    @Param() param: PutMenuImagesRequestParamDto,
    @Body() body: PutMenuImagesRequestBodyDto,
  ) {
    return this.menusService.putImages({ ...param, ...body });
  }

  @Put('/menus/:menuId/options')
  @Auth()
  @ApiOperation({ summary: 'Put Menu Options' })
  async putMenuOptions(
    @Param() param: PutMenuOptionsRequestParamDto,
    @Body() body: PutMenuOptionsRequestBodyDto,
  ) {
    return this.menusService.putOptions({ ...param, ...body });
  }

  @Patch('/menus/:menuId/translate/:translateId')
  @Auth()
  @ApiOperation({ summary: 'Menu Tranlsate Update' })
  async patchTranslate(
    @Param() param: PatchMenuTranslateRequestParamDto,
    @Body() body: PatchMenuTranslateRequestBodyDto,
  ) {
    return this.menusService.patchTranslate({ ...param, ...body });
  }

  @Get('/menus/:menuId')
  @ApiOperation({
    summary: 'Get Menu',
  })
  @ApiResponse({ type: GetMenuyResponseDto })
  async getMenu(
    @Param() param: GetMenuRequestParamDto,
    @Query() query: GetMenuRequestQueryDto,
  ): Promise<GetMenuyResponseDto> {
    const menu = await this.menusService.getMenu({ ...param, ...query });
    return { menu };
  }

  @Get('/menus')
  @ApiOperation({
    summary: 'List Menus',
  })
  @ApiResponse({ type: ListMenusResponseDto })
  async listtMenu(
    @Query() query: ListMenusRequestQueryDto,
  ): Promise<ListMenusResponseDto> {
    const [menus, totalSize] = await this.menusService.listMenus({ ...query });
    return { menus, totalSize };
  }

  @Patch('/menus/:menuId')
  @Auth()
  @ApiOperation({
    summary: 'Patch Menu',
  })
  async patchMenu(
    @Param() param: PatchMenuRequestParamDto,
    @Body() body: PatchMenuRequestBodyDto,
  ) {
    return { menu: await this.menusService.patchMenu({ ...param, ...body }) };
  }

  @Delete('/menus/:menuId')
  @Auth()
  @ApiOperation({
    summary: 'Delete Menu',
  })
  deleteMenu(@Param() param: DeleteMenuRequestParamDto) {
    return this.menusService.deleteMenu({ ...param });
  }

  @Post('/menus')
  @Auth()
  @ApiOperation({
    summary: 'Create Menu',
  })
  async createMenu(@Body() body: CreateMenuRequestBodyDto) {
    return { menu: await this.menusService.createMenu({ ...body }) };
  }
}
