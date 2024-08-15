import { InjectRepository } from '@nestjs/typeorm';
import {
  SignUpWithEmailRequestBodyDto,
  SignUpWithEmailResponseDto,
} from '../dtos/sign-up-with-email.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { throwError } from 'src/common/error';
import { AccountsError } from '../accounts.error';
import { hash } from 'bcrypt';
import { TokenService } from '../services/token.service';

export class SignUpWithEmailCommand {
  constructor(public request: SignUpWithEmailRequestBodyDto) {}
}

@CommandHandler(SignUpWithEmailCommand)
export class SignUpWithEmailCommandHandler
  implements
    ICommandHandler<SignUpWithEmailCommand, SignUpWithEmailResponseDto>
{
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private tokenService: TokenService,
  ) {}

  async execute(
    command: SignUpWithEmailCommand,
  ): Promise<SignUpWithEmailResponseDto> {
    const { request } = command;

    if (
      await this.accountRepository.exist({
        where: {
          email: request.email,
        },
      })
    ) {
      throwError(AccountsError.CONFLICT_EMAIL);
    }

    let account = this.accountRepository.create();

    account.email = request.email;
    account.password = await hash(request.password, 10);

    account = await this.accountRepository.save(account);

    const token = await this.tokenService.generate(account);

    return {
      token,
    };
  }
}
