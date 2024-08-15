import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { COMMAND_HANDLERS } from './commands';
import { TokenService } from './services/token.service';
import { HttpModule } from '@nestjs/axios';
import { SellersModule } from 'src/sellers/sellers.module';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    CqrsModule,
    HttpModule,
    SellersModule,
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AccountsController],
  providers: [TokenService, AccountsService, ...COMMAND_HANDLERS],
})
export class AccountsModule {}
