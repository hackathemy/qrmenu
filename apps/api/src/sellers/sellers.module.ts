import { Module } from '@nestjs/common';
import { SellersController } from './sellers.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { SellerTranslate } from './entities/seller-translate.entity';
import { SellersService } from './sellers.service';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Seller, SellerTranslate])],
  controllers: [SellersController],
  providers: [SellersService],
  exports: [SellersService],
})
export class SellersModule {}
