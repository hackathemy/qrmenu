import { RequestUser, Role } from '@hackathon-qrmenu/type';
import {
  PatchAccountRequestBodyDto,
  PatchAccountRequestParamDto,
  PatchAccountResponseDto,
} from '../dtos/patch-account.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { CommonError, throwError } from 'src/common/error';
import { UpdateableField } from '../types';
import { AccountDto } from '../dtos/account.dto';

export class PatchAccountCommand {
  constructor(
    public request: PatchAccountRequestBodyDto & PatchAccountRequestParamDto,
    public requestUser: RequestUser,
  ) {}
}

@CommandHandler(PatchAccountCommand)
export class PatchAccountCommandHandler
  implements ICommandHandler<PatchAccountCommand, PatchAccountResponseDto>
{
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async execute(
    command: PatchAccountCommand,
  ): Promise<PatchAccountResponseDto> {
    const { request, requestUser } = command;
    const isAdmin = requestUser.roles.includes(Role.ADMIN);

    if (!isAdmin && request.accountId !== requestUser.accountId.toString()) {
      throwError(CommonError.ERR_FORBIDDEN);
    }

    let account = await this.accountRepository.findOneBy({
      id: parseInt(request.accountId),
    });

    if (!account) {
      throwError(CommonError.ERR_NOT_FOUND);
    }

    const updateFields = request.updateMask
      .split(',')
      .map((x) => x.trim())
      .filter((x) => x);

    if (updateFields.includes(UpdateableField.STATUS)) {
      if (!isAdmin) {
        throwError(CommonError.ERR_FORBIDDEN);
      }
      account.status = request.account.status;
    }

    account = await this.accountRepository.save(account);

    const accountDto = new AccountDto();
    
    accountDto.createdAt = account.createdAt;
    accountDto.id = account.id;
    accountDto.email = account.email;
    accountDto.status = account.status;
    accountDto.phoneNumber = account.phoneNumber;

    return { account: accountDto };
  }
}
