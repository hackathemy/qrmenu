import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  RefreshTokenRequestBodyDto,
  RefreshTokenResponseDto,
} from '../dtos/refresh-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { TokenService } from '../services/token.service';
import { throwError } from 'src/common/error';
import { AccountsError } from '../accounts.error';

export class RefreshTokenCommand {
  constructor(public request: RefreshTokenRequestBodyDto) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand, RefreshTokenResponseDto>
{
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    private tokenService: TokenService,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenResponseDto> {
    const { request } = command;

    const account = await this.accountRepository.findOneBy({
      refreshToken: request.refreshToken,
    });

    if (!account) {
      throwError(AccountsError.FAILED_REFRESH_TOKEN);
    }

    return { token: await this.tokenService.generate(account) };
  }
}
