import { Injectable } from '@nestjs/common';
import { Account } from '../entities/account.entity';
import { TokenDto } from 'src/auth/dtos/token.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '@hackathemy-qrmenu/type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async generate(account: Account): Promise<TokenDto> {
    const payload: TokenPayload = {
      sub: account.id,
      accountId: account.id,
      roles: account.roles,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: account.id },
      {
        expiresIn: '14d',
      },
    );

    await this.accountRepository.update({ id: account.id }, { refreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }
}
