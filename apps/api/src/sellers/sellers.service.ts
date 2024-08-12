import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';
import { GetSellerByAccountRequestParamDto } from './dtos/get-seller-by-account.dto';
import { CreateSellerRequestBodyDto } from './dtos/create-seller.dto';
import { AccountStatus, LangCode, RequestUser } from '@hackathon-qrmenu/type';
import { GetSellerRequestParamDto } from './dtos/get-seller.dto';
import { Account } from 'src/accounts/entities/account.entity';
import { File } from 'src/files/entities/file.entity';
import { ListSellersRequestQueryDto } from './dtos/list-sellers.dto';
import {
  GetStatsRequestQueryDto,
  GetStatsResponseDto,
} from './dtos/get-stats.dto';
import {
  PatchSellerRequestBodyDto,
  PatchSellerRequestParamDto,
} from './dtos/patch-seller.dto';
import { TranslateUpdateableField, UpdateableField } from './types';
import {
  CreateSellerTranslateRequestBodyDto,
  CreateSellerTranslateRequestParamDto,
} from './dtos/create-seller-translate.dto';
import { SellerTranslate } from './entities/seller-translate.entity';
import {
  GetSellerTranslateBySellerRequestParamDto,
  GetSellerTranslateBySellerRequestQueryDto,
} from './dtos/get-seller-translate-by-seller.dto';
import {
  PatchSellerTranslateRequestBodyDto,
  PatchSellerTranslateRequestParamDto,
} from './dtos/patch-seller-translate.dto';
import { SellerTranslateDto } from './dtos/seller-translate.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import * as dayjs from 'dayjs';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller) private sellerRepository: Repository<Seller>,
    @InjectRepository(SellerTranslate)
    private sellerTranslateRepository: Repository<SellerTranslate>,
  ) {}

  async getTranslateBySeller(
    request: GetSellerTranslateBySellerRequestParamDto &
      GetSellerTranslateBySellerRequestQueryDto,
  ) {
    const entity = await this.sellerTranslateRepository.findOneBy({
      seller: {
        id: parseInt(request.sellerId),
      },
      langCode: request.langCode,
    });

    return entity;
  }

  async patchSellerTranslate(
    request: PatchSellerTranslateRequestBodyDto &
      PatchSellerTranslateRequestParamDto,
  ) {
    let translate = await this.sellerTranslateRepository.findOneBy({
      id: parseInt(request.translateId),
    });

    if (!translate) {
      throw new NotFoundException();
    }

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    const update: QueryDeepPartialEntity<SellerTranslate> = {};
    const updated: { [key: string]: string } = {};

    if (updateFields.includes(TranslateUpdateableField.Address)) {
      update['address'] = request.translate.address;
      updated['address'] = update['address'];
      update.nameUpdatedAt = () => 'NOW()';
    }

    if (updateFields.includes(TranslateUpdateableField.AddressDetail)) {
      update['addressDetail'] = request.translate.addressDetail;
      updated['addressDetail'] = update['addressDetail'];
      update.nameUpdatedAt = () => 'NOW()';
    }

    if (updateFields.includes(TranslateUpdateableField.IntroductionHtml)) {
      update['introductionHtml'] = request.translate.introductionHtml;
      updated['introductionHtml'] = update['introductionHtml'];
      update.introductionHtmlUpdatedAt = () => 'NOW()';
    }

    if (updateFields.includes(TranslateUpdateableField.Name)) {
      update['name'] = request.translate.name;
      updated['name'] = update['name'];
      update.nameUpdatedAt = () => 'NOW()';
    }

    if (updateFields.includes(TranslateUpdateableField.AccessibilityHtml)) {
      update['accessibilityHtml'] = request.translate.accessibilityHtml;
      updated['accessibilityHtml'] = update['accessibilityHtml'];
      update.accessibilityHtmlUpdatedAt = () => 'NOW()';
    }

    if (updateFields.includes(TranslateUpdateableField.ToiletHtml)) {
      update['toiletHtml'] = request.translate.toiletHtml;
      updated['toiletHtml'] = update['toiletHtml'];
      update.toiletHtmlUpdatedAt = () => 'NOW()';
    }

    if (updateFields.includes(TranslateUpdateableField.ParkingHtml)) {
      update['parkingHtml'] = request.translate.parkingHtml;
      updated['parkingHtml'] = update['parkingHtml'];
      update.parkingHtmlUpdatedAt = () => 'NOW()';
    }

    if (updateFields.includes(TranslateUpdateableField.KidsHtml)) {
      update['kidsHtml'] = request.translate.kidsHtml;
      updated['kidsHtml'] = update['kidsHtml'];
      update.kidsHtmlUpdatedAt = () => 'NOW()';
    }

    await this.sellerTranslateRepository.update({ id: translate.id }, update);

    return await this.sellerTranslateRepository.findOneBy({
      id: parseInt(request.translateId),
    });
  }

  async createTranslate(
    request: CreateSellerTranslateRequestBodyDto &
      CreateSellerTranslateRequestParamDto,
  ) {
    if (
      await this.sellerTranslateRepository.exist({
        where: {
          seller: {
            id: parseInt(request.sellerId),
          },
          langCode: request.langCode,
        },
      })
    ) {
      throw new ConflictException();
    }

    const seller = await this.getSeller({ sellerId: request.sellerId });

    let entity = this.sellerTranslateRepository.create();
    entity.address = seller.address;
    entity.addressDetail = seller.addressDetail;
    entity.name = seller.name;
    entity.langCode = request.langCode;
    entity.seller = seller;
    entity.introductionHtml = '';
    entity.kidsHtml = '';
    entity.parkingHtml = '';
    entity.toiletHtml = '';
    entity.accessibilityHtml = '';

    entity = await this.sellerTranslateRepository.save(entity);

    return entity;
  }

  mapTranslateDto(entity: SellerTranslate): SellerTranslateDto {
    const dto = new SellerTranslateDto();

    dto.id = entity.id;
    dto.address = entity.address;
    dto.addressDetail = entity.addressDetail;
    dto.introductionHtml = entity.introductionHtml;

    dto.langCode = entity.langCode;
    dto.name = entity.name;
    dto.nameUpdatedAt = entity.nameUpdatedAt;
    dto.nameTranslatedAt = entity.nameTranslatedAt;
    dto.introductionHtmlTranslatedAt = entity.introductionHtmlTranslatedAt;
    dto.introductionHtmlUpdatedAt = entity.introductionHtmlUpdatedAt;

    dto.kidsHtml = entity.kidsHtml;
    dto.kidsHtmlUpdatedAt = entity.kidsHtmlUpdatedAt;
    dto.kidsHtmlTranslatedAt = entity.kidsHtmlTranslatedAt;

    dto.parkingHtml = entity.parkingHtml;
    dto.parkingHtmlUpdatedAt = entity.parkingHtmlUpdatedAt;
    dto.parkingHtmlTranslatedAt = entity.parkingHtmlTranslatedAt;

    dto.toiletHtml = entity.toiletHtml;
    dto.toiletHtmlUpdatedAt = entity.toiletHtmlUpdatedAt;
    dto.toiletHtmlTranslatedAt = entity.toiletHtmlTranslatedAt;

    dto.accessibilityHtml = entity.accessibilityHtml;
    dto.accessibilityHtmlUpdatedAt = entity.accessibilityHtmlUpdatedAt;
    dto.accessibilityHtmlTranslatedAt = entity.accessibilityHtmlTranslatedAt;

    return dto;
  }

  async getStats(
    request: GetStatsRequestQueryDto,
  ): Promise<GetStatsResponseDto> {
    const interval = `${
      dayjs(request.dateMax).diff(dayjs(request.dateMin), 'day') || 1
    } day`;

    const createdData = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoin('seller.account', 'account')
      .select([
        "to_char(account.createdAt, 'YYYY-MM-DD') as date",
        'COUNT(seller.id) AS size',
      ])
      .where('Date(account.createdAt) >= :dateMin', {
        dateMin: request.dateMin,
      })
      .andWhere('Date(account.createdAt) <= :dateMax', {
        dateMax: request.dateMax,
      })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const createdValue = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoin('seller.account', 'account')
      .select(['COUNT(seller.id) AS size'])
      .where(
        `Date(account.createdAt) >= Date(:dateMin) - interval '${interval}'`,
        {
          dateMin: request.dateMin,
        },
      )
      .andWhere('Date(account.createdAt) < :dateMax', {
        dateMax: request.dateMin,
      })
      .getRawOne();

    const activeData = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoin('seller.account', 'account')
      .select([
        "to_char(account.createdAt, 'YYYY-MM-DD') as date",
        'COUNT(seller.id) AS size',
      ])
      .where('Date(account.createdAt) >= :dateMin', {
        dateMin: request.dateMin,
      })
      .andWhere('Date(account.createdAt) <= :dateMax', {
        dateMax: request.dateMax,
      })
      .andWhere('account.status = :status', { status: AccountStatus.ACTIVE })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const activeValue = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoin('seller.account', 'account')
      .select(['COUNT(seller.id) AS size'])
      .where(
        `Date(account.createdAt) >= Date(:dateMin) - interval '${interval}'`,
        {
          dateMin: request.dateMin,
        },
      )
      .andWhere('Date(account.createdAt) < :dateMax', {
        dateMax: request.dateMin,
      })
      .andWhere('account.status = :status', { status: AccountStatus.ACTIVE })

      .getRawOne();

    const inActiveData = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoin('seller.account', 'account')
      .select([
        "to_char(account.createdAt, 'YYYY-MM-DD') as date",
        'COUNT(seller.id) AS size',
      ])
      .where('Date(account.createdAt) >= :dateMin', {
        dateMin: request.dateMin,
      })
      .andWhere('Date(account.createdAt) <= :dateMax', {
        dateMax: request.dateMax,
      })
      .andWhere('account.status != :status', { status: AccountStatus.ACTIVE })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const inActiveValue = await this.sellerRepository
      .createQueryBuilder('seller')
      .leftJoin('seller.account', 'account')
      .select(['COUNT(seller.id) AS size'])
      .where(
        `Date(account.createdAt) >= Date(:dateMin) - interval '${interval}'`,
        {
          dateMin: request.dateMin,
        },
      )
      .andWhere('Date(account.createdAt) < :dateMax', {
        dateMax: request.dateMin,
      })
      .andWhere('account.status != :status', { status: AccountStatus.ACTIVE })

      .getRawOne();

    return {
      createdData,
      activeData,
      inActiveData,
      createdPrevSize: parseInt(createdValue?.size),
      activePrevSize: parseInt(activeValue?.size),
      inActivePrevSize: parseInt(inActiveValue?.size),
    };
  }

  async createSeller(request: CreateSellerRequestBodyDto, user: RequestUser) {
    if (
      await this.getSellerByAccount({ accountId: user.accountId.toString() })
    ) {
      throw new ConflictException();
    }

    let seller = this.sellerRepository.create();

    seller.account = { id: user.accountId } as Account;
    seller.address = request.address;
    seller.addressDetail = request.addressDetail;
    seller.ceoName = request.ceoName;
    seller.ceoPhoneNumber = request.ceoPhoneNumber;
    seller.companyName = request.companyName;
    seller.companyNumber = request.companyNumber;
    seller.companyNumberImage = {
      id: request.companyNumberImageFileId,
    } as File;
    seller.contact = request.contact;
    seller.managerPhoneNumber = request.managerPhoneNumber;
    seller.name = request.name;
    seller.type = request.type;

    seller = await this.sellerRepository.save(seller);

    /** default translate creation */
    this.createTranslate({
      sellerId: seller.id.toString(),
      langCode: LangCode.KO,
    });

    seller = await this.getSeller({ sellerId: seller.id.toString() });

    return seller;
  }

  async listSellers(request: ListSellersRequestQueryDto) {
    return await this.sellerRepository
      .createQueryBuilder('seller')
      .select()
      .innerJoinAndSelect('seller.account', 'account')
      .innerJoinAndSelect('seller.companyNumberImage', 'companyNumberImage')
      .where(
        () =>
          request.text
            ? 'seller.name LIKE :text OR seller.ceoName LIKE :text'
            : '',
        { text: `%${request.text}%` },
      )
      .take(parseInt(request.pageLimit))
      .skip(parseInt(request.pageOffset))
      .orderBy(
        request.orderBy
          ? {
              [request.orderBy.split(',')[0].trim()]: request.orderBy
                .split(',')[1]
                .trim() as 'DESC' | 'ASC',
            }
          : { 'seller.createdAt': 'DESC' },
      )
      .getManyAndCount();
  }

  async getSeller(request: GetSellerRequestParamDto) {
    const seller = await this.sellerRepository
      .createQueryBuilder('seller')
      .select()
      .innerJoinAndSelect('seller.account', 'account')
      .innerJoinAndSelect('seller.companyNumberImage', 'companyNumberImage')
      .where('seller.id = :id', { id: request.sellerId })
      .getOne();

    return seller;
  }

  async patchSeller(
    request: PatchSellerRequestBodyDto & PatchSellerRequestParamDto,
    user: RequestUser,
  ) {
    let seller = await this.getSeller({ sellerId: request.sellerId });

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    if (updateFields.includes(UpdateableField.VISIBLE)) {
      seller.visible = request.seller.visible;
    }

    if (updateFields.includes(UpdateableField.ADDRESS_DETAIL)) {
      seller.addressDetail = request.seller.addressDetail;
    }

    if (updateFields.includes(UpdateableField.CONTACT)) {
      seller.contact = request.seller.contact;
    }

    if (updateFields.includes(UpdateableField.ADDRESS)) {
      seller.address = request.seller.address;
    }

    if (updateFields.includes(UpdateableField.OPEN_TIME)) {
      seller.openTime = request.seller.openTime;
    }

    if (updateFields.includes(UpdateableField.MANAGE_PHONE_NUMBER)) {
      seller.managerPhoneNumber = request.seller.managerPhoneNumber;
    }

    if (updateFields.includes(UpdateableField.PREPAYMENT)) {
      seller.prepayment = request.seller.prepayment;
    }

    if (updateFields.includes(UpdateableField.GUIDE_ORDERS)) {
      seller.guideOrders = request.seller.guideOrders;
    }

    if (updateFields.includes(UpdateableField.WIFI_KEY)) {
      seller.wifiKey = request.seller.wifiKey;
    }

    if (updateFields.includes(UpdateableField.WIFI_SSID)) {
      seller.wifiSSID = request.seller.wifiSSID;
    }

    if (updateFields.includes(UpdateableField.ENABLED_ACCESSIBILITY)) {
      seller.enabledAccessibility = request.seller.enabledAccessibility;
    }

    if (updateFields.includes(UpdateableField.ENABLED_KIDS)) {
      seller.enabledKids = request.seller.enabledKids;
    }

    if (updateFields.includes(UpdateableField.ENABLED_PARKING)) {
      seller.enabledParking = request.seller.enabledParking;
    }

    if (updateFields.includes(UpdateableField.ENABLED_PAYMENT)) {
      seller.enabledPayment = request.seller.enabledPayment;
    }

    if (updateFields.includes(UpdateableField.ENABLED_TOILET)) {
      seller.enabledToilet = request.seller.enabledToilet;
    }

    if (updateFields.includes(UpdateableField.ENABLED_WIFI)) {
      seller.enabledWifi = request.seller.enabledWifi;
    }

    if (updateFields.includes(UpdateableField.PaymentCardTypes)) {
      seller.paymentCardTypes = request.seller.paymentCardTypes;
    }

    if (updateFields.includes(UpdateableField.PaymentCashTypes)) {
      seller.paymentCashTypes = request.seller.paymentCashTypes;
    }

    if (updateFields.includes(UpdateableField.PaymentSmartPayTypes)) {
      seller.paymentSmartPayTypes = request.seller.paymentSmartPayTypes;
    }

    seller = await this.sellerRepository.save(seller);

    return seller;
  }

  async getSellerByAccount(request: GetSellerByAccountRequestParamDto) {
    const seller = await this.sellerRepository.findOne({
      where: {
        account: { id: parseInt(request.accountId) },
      },
      relations: { account: true, companyNumberImage: true },
    });

    return seller;
  }
}
