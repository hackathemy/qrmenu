import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { GetAccountRequestParamDto } from './dtos/get-account.dto';
import { RequestUser } from 'src/auth/types';
import { CommonError, throwError } from 'src/common/error';
import { AccountsError } from './accounts.error';
import { AccountDto } from './dtos/account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  exist(email: string) {
    return this.accountRepository.exist({ where: { email } });
  }

  async getAccount(
    request: GetAccountRequestParamDto,
    requestUser: RequestUser,
  ) {
    if (request.accountId !== requestUser.accountId.toString()) {
      throwError(CommonError.ERR_FORBIDDEN);
    }

    const account = await this.accountRepository.findOne({
      where: {
        id: parseInt(request.accountId),
      },
    });

    if (!account) {
      throwError(AccountsError.NOT_FOUND_ACCOUNT);
    }

    const accountDto = new AccountDto();

    accountDto.email = account.email;
    accountDto.id = account.id;
    accountDto.createdAt = account.createdAt;
    accountDto.phoneNumber = account.phoneNumber;

    return {
      account: accountDto,
    };
  }
}
