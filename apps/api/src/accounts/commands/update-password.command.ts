import { RequestUser } from '@hackathon/type';
import { DeleteAccountResponseDto } from '../dtos/delete-account.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { CommonError, throwError } from 'src/common/error';
import {
  UpdatePasswordRequestBodyDto,
  UpdatePasswordRequestParamDto,
  UpdatePasswordResponseDto,
} from '../dtos/update-password.dto';
import { compare, hash } from 'bcrypt';
import { AccountsError } from '../accounts.error';
import { UnprocessableEntityException } from '@nestjs/common';

export class UpdatePasswordCommand {
  constructor(
    public request: UpdatePasswordRequestBodyDto &
      UpdatePasswordRequestParamDto,
    public requestUser: RequestUser,
  ) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler
  implements ICommandHandler<UpdatePasswordCommand, UpdatePasswordResponseDto>
{
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async execute(
    command: UpdatePasswordCommand,
  ): Promise<DeleteAccountResponseDto> {
    const { request, requestUser } = command;

    if (request.accountId !== requestUser.accountId.toString()) {
      throwError(CommonError.ERR_FORBIDDEN);
    }

    const account = await this.accountRepository.findOneBy({
      id: parseInt(request.accountId),
    });

    if (!account) {
      throwError(AccountsError.NOT_FOUND_ACCOUNT);
    }

    if (!(await compare(request.password, account.password))) {
      throw new UnprocessableEntityException('Invalid current password.');
    }

    account.password = await hash(request.newPassword, 10);

    await this.accountRepository.save(account);

    return {};
  }
}
