import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from '@hackathemy-qrmenu/type';
import {
  ListSellersRequestQueryDto,
  ListSellersResponseDto,
} from './dtos/list-sellers.dto';
import {
  GetSellerRequestParamDto,
  GetSellerResponseDto,
} from './dtos/get-seller.dto';
import {
  GetSellerByAccountRequestParamDto,
  GetSellerByAccountResponseDto,
} from './dtos/get-seller-by-account.dto';
import {
  CreateSellerRequestBodyDto,
  CreateSellerResponseDto,
} from './dtos/create-seller.dto';
import { SellersService } from './sellers.service';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import {
  GetStatsRequestQueryDto,
  GetStatsResponseDto,
} from './dtos/get-stats.dto';
import {
  PatchSellerRequestBodyDto,
  PatchSellerRequestParamDto,
  PatchSellerResponseDto,
} from './dtos/patch-seller.dto';
import {
  PatchSellerTranslateRequestBodyDto,
  PatchSellerTranslateRequestParamDto,
  PatchSellerTranslateResponseDto,
} from './dtos/patch-seller-translate.dto';
import {
  CreateSellerTranslateRequestBodyDto,
  CreateSellerTranslateRequestParamDto,
  CreateSellerTranslateResponseDto,
} from './dtos/create-seller-translate.dto';
import {
  GetSellerTranslateBySellerRequestParamDto,
  GetSellerTranslateBySellerRequestQueryDto,
  GetSellerTranslateBySellerResponseDto,
} from './dtos/get-seller-translate-by-seller.dto';

@Controller()
@ApiTags('Seller API')
export class SellersController {
  constructor(private sellersService: SellersService) {}
  @Patch('/sellers/:sellerId/translate/:translateId')
  @Auth()
  @ApiOperation({ summary: '번역 수정' })
  @ApiResponse({ type: PatchSellerTranslateResponseDto })
  async patchTranslate(
    @Param() param: PatchSellerTranslateRequestParamDto,
    @Body() body: PatchSellerTranslateRequestBodyDto,
    @RequestUser() requestUser,
  ): Promise<CreateSellerTranslateResponseDto> {
    const translate = await this.sellersService.patchSellerTranslate({
      ...param,
      ...body,
    });

    return { translate: this.sellersService.mapTranslateDto(translate) };
  }

  @Post('/sellers/:sellerId/translate')
  @Auth()
  @ApiOperation({ summary: '번역 생성' })
  @ApiResponse({ type: CreateSellerTranslateResponseDto })
  async createTranslate(
    @Param() param: CreateSellerTranslateRequestParamDto,
    @Body() body: CreateSellerTranslateRequestBodyDto,
    @RequestUser() requestUser,
  ): Promise<CreateSellerTranslateResponseDto> {
    const translate = await this.sellersService.createTranslate({
      ...param,
      ...body,
    });

    return { translate: this.sellersService.mapTranslateDto(translate) };
  }

  @Get('/sellers/:sellerId/translate')
  @ApiOperation({ summary: '번역 조회' })
  @ApiResponse({ type: GetSellerTranslateBySellerResponseDto })
  async getTranslateBySeller(
    @Param() param: GetSellerTranslateBySellerRequestParamDto,
    @Query() query: GetSellerTranslateBySellerRequestQueryDto,
  ): Promise<CreateSellerTranslateResponseDto> {
    const translate = await this.sellersService.getTranslateBySeller({
      ...param,
      ...query,
    });
    if (!translate) throw new NotFoundException();
    return { translate: this.sellersService.mapTranslateDto(translate) };
  }

  @Patch('/sellers/:sellerId')
  @Auth()
  @ApiOperation({ summary: '판매자 수정' })
  @ApiResponse({ type: PatchSellerResponseDto })
  async patchSeller(
    @Param() param: PatchSellerRequestParamDto,
    @Body() body: PatchSellerRequestBodyDto,
    @RequestUser() requestUser,
  ) {
    const seller = await this.sellersService.patchSeller(
      { ...param, ...body },
      requestUser,
    );

    return { seller };
  }

  @Get('/sellers/:sellerId')
  @ApiOperation({ summary: '판매자 찾기' })
  @ApiResponse({ type: GetSellerResponseDto })
  async getSeller(@Param() param: GetSellerRequestParamDto) {
    const seller = await this.sellersService.getSeller(param);
    if (!seller) {
      throw new NotFoundException();
    }

    return { seller };
  }

  @Get('/accounts/:accountId/seller')
  @ApiOperation({ summary: '계정에 연결된 판매자 찾기' })
  @ApiResponse({ type: GetSellerByAccountResponseDto })
  async getSellerByAccount(@Param() param: GetSellerByAccountRequestParamDto) {
    const seller = await this.sellersService.getSellerByAccount(param);
    if (!seller) {
      throw new NotFoundException();
    }

    return { seller };
  }

  @Get('/sellers[:]getStats')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '판매자 통계 조회' })
  @ApiResponse({ type: GetStatsResponseDto })
  async getStats(
    @Query() query: GetStatsRequestQueryDto,
  ): Promise<GetStatsResponseDto> {
    return await this.sellersService.getStats(query);
  }

  @Get('/sellers')
  @Auth(Role.ADMIN)
  @ApiOperation({ summary: '판매자 전체 조회' })
  @ApiResponse({ type: ListSellersResponseDto })
  async listSellers(
    @Query() query: ListSellersRequestQueryDto,
  ): Promise<ListSellersResponseDto> {
    const [sellers, totalSize] = await this.sellersService.listSellers(query);

    return { sellers, totalSize };
  }

  @Post('/sellers')
  @Auth()
  @ApiOperation({ summary: 'Create Seller' })
  @ApiResponse({ type: CreateSellerResponseDto })
  createSeller(
    @Body() body: CreateSellerRequestBodyDto,
    @RequestUser() reqUser,
  ) {
    return this.sellersService.createSeller(body, reqUser);
  }
}
