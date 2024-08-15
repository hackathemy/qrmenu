import { RequestUser, Role } from '@hackathemy-qrmenu/type';
import {
  DeleteAccountReqeustBodyDto,
  DeleteAccountRequestParamDto,
  DeleteAccountResponseDto,
} from '../dtos/delete-account.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { CommonError, throwError } from 'src/common/error';
import { UnprocessableEntityException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { SellersService } from 'src/sellers/sellers.service';
import { AccountsError } from '../accounts.error';

/** 회원 탈퇴 */
export class DeleteAccountCommand {
  constructor(
    public request: DeleteAccountRequestParamDto & DeleteAccountReqeustBodyDto,
    public requestUser: RequestUser,
  ) {}
}

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler
  implements ICommandHandler<DeleteAccountCommand, DeleteAccountResponseDto>
{
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private sellersService: SellersService,
  ) {}

  async execute(
    command: DeleteAccountCommand,
  ): Promise<DeleteAccountResponseDto> {
    const { request, requestUser } = command;

    const adminRequest = requestUser.roles.includes(Role.ADMIN);
    if (
      !adminRequest &&
      request.accountId !== requestUser.accountId.toString()
    ) {
      throwError(CommonError.ERR_FORBIDDEN);
    }

    const account = await this.accountRepository.findOneBy({
      id: parseInt(request.accountId),
    });

    if (!account) {
      throwError(CommonError.ERR_NOT_FOUND);
    }

    if (account.deletedAt) {
      throwError(CommonError.ERR_UNPROCESSABLE);
    }

    const seller = await this.sellersService.getSellerByAccount({
      accountId: account.id.toString(),
    });
    if (seller.ceoName !== request.ceoName) {
      throwError(AccountsError.INVLIAD_CEONAME);
    }

    if (!adminRequest) {
      if (!request.authId) {
        throw new UnprocessableEntityException('invalid phone number');
      }

      if (!(await compare(request.password, account.password))) {
        throw throwError(AccountsError.INVLIAD_PASSWORD);
      }
    }

    await this.accountRepository.update(
      { id: account.id },
      { deletedAt: () => 'NOW()' },
    );

    return {};
  }
}
