import { InjectRepository } from '@nestjs/typeorm';
import {
  SignInWithEmailRequestBodyDto,
  SignInWithEmailResponseDto,
} from '../dtos/sign-in-with-email.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { throwError } from 'src/common/error';
import { AccountsError } from '../accounts.error';
import { TokenService } from '../services/token.service';
import { AccountStatus, Role } from '@hackathon/type';

export class SignInWithEmailCommand {
  constructor(public request: SignInWithEmailRequestBodyDto) {}
}

@CommandHandler(SignInWithEmailCommand)
export class SignInWithEmailCommandHandler
  implements
    ICommandHandler<SignInWithEmailCommand, SignInWithEmailResponseDto>
{
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private tokenService: TokenService,
  ) {}

  async execute(
    command: SignInWithEmailCommand,
  ): Promise<SignInWithEmailResponseDto> {
    const { request } = command;

    const account = await this.accountRepository.findOneBy({
      email: request.email,
    });

    if (!account || !(await compare(request.password, account.password))) {
      throwError(AccountsError.FAILED_LOGIN);
    }

    if (account.status === AccountStatus.REJECTED && !account.roles.includes(Role.ADMIN)) {
      throwError(AccountsError.REJECTED_STATUS);
    }

    return { token: await this.tokenService.generate(account) };
  }
}
