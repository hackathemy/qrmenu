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
import {
  CreateContentsRequestBodyDto,
  CreateContentsResponseDto,
} from './dtos/create-contents.dto';
import {
  PatchContentRequestBodyDto,
  PatchContentRequestParamDto,
  PatchContentResponseDto,
} from './dtos/patch-content.dto';
import {
  ListContentsRequestQueryDto,
  ListContentsResponseDto,
} from './dtos/list-contents.dto';
import {
  GetContentRequestQueryDto,
  GetContentResponseDto,
  GetContentsequestParamDto,
} from './dtos/get-content.dto';
import {
  DeleteContentRequestParamDto,
  DeleteContentResponseDto,
} from './dtos/delete-content.dto';
import {
  PatchContentTranslateRequestBodyDto,
  PatchContentTranslateRequestParamDto,
  PatchContentTranslateyResponseDto,
} from './dtos/patch-content-translate.dto';
import {
  PutContentMenusRequestBodyDto,
  PutContentMenusRequestParamDto,
  PutContentMenusResponseDto,
} from './dtos/put-menus.dto';
import { ContentsService } from './contents.service';
import {
  ListMenusRequestParamDto,
  ListMenusRequestQueryDto,
  ListMenusResponseDto,
} from './dtos/list-menus.dto';

@Controller()
@ApiTags('Content API')
export class ContentsController {
  constructor(private contentsService: ContentsService) {}

  @Patch('/contents/:contentId/translate/:translateId')
  @Auth()
  @ApiOperation({ summary: '번역 수정' })
  @ApiResponse({ type: PatchContentTranslateyResponseDto })
  patchTranslate(
    @Param() param: PatchContentTranslateRequestParamDto,
    @Body() body: PatchContentTranslateRequestBodyDto,
  ) {
    return this.contentsService.patchContentTranslate({ ...param, ...body });
  }

  @Post('/contents')
  @Auth()
  @ApiOperation({ summary: 'Create Content' })
  @ApiResponse({ type: CreateContentsResponseDto })
  async createContent(@Body() body: CreateContentsRequestBodyDto) {
    return { content: await this.contentsService.createContent({ ...body }) };
  }

  @Get('/contents/:contentId/menus')
  @ApiOperation({ summary: 'List Menus' })
  @ApiResponse({ type: ListMenusResponseDto })
  async listMenus(
    @Param() param: ListMenusRequestParamDto,
    @Query() query: ListMenusRequestQueryDto,
  ) {
    return {
      menus: await this.contentsService.listMenus({ ...param, ...query }),
    };
  }

  @Put('/contents/:contentId/menus')
  @Auth()
  @ApiOperation({ summary: 'Put Menus' })
  @ApiResponse({ type: PutContentMenusResponseDto })
  putMenus(
    @Param() param: PutContentMenusRequestParamDto,
    @Body() body: PutContentMenusRequestBodyDto,
  ) {
    return this.contentsService.putMenus({ ...body, ...param });
  }

  @Patch('/contents/:contentId')
  @Auth()
  @ApiOperation({ summary: 'Patch Content' })
  @ApiResponse({ type: PatchContentResponseDto })
  patchContent(
    @Param() param: PatchContentRequestParamDto,
    @Body() body: PatchContentRequestBodyDto,
  ) {
    return this.contentsService.patchContent({ ...body, ...param });
  }

  @Post('/contents/:contentId[:]view')
  @ApiOperation({ summary: 'View Content' })
  viewContent(@Param('contentId') contentId: string) {
    return this.contentsService.viewContent(contentId);
  }

  @Get('/contents/:contentId')
  @ApiOperation({ summary: 'Get Content' })
  @ApiResponse({ type: GetContentResponseDto })
  async getContent(
    @Query() query: GetContentRequestQueryDto,
    @Param() param: GetContentsequestParamDto,
  ) {
    return {
      content: await this.contentsService.getContent({ ...query, ...param }),
    };
  }

  @Delete('/contents/:contentId')
  @Auth()
  @ApiOperation({ summary: 'Delete Content' })
  @ApiResponse({ type: DeleteContentResponseDto })
  deleteContent(@Param() param: DeleteContentRequestParamDto) {
    return this.contentsService.deleteContent({ ...param });
  }

  @Get('/contents')
  @ApiOperation({ summary: 'List Contents' })
  @ApiResponse({ type: ListContentsResponseDto })
  async listContents(@Query() query: ListContentsRequestQueryDto) {
    const [contents, totalSize] = await this.contentsService.listContents({
      ...query,
    });
    return {
      contents,
      totalSize,
    };
  }
}
