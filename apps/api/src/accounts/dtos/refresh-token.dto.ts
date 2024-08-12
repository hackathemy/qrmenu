import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from 'src/auth/dtos/token.dto';

export class RefreshTokenRequestBodyDto {
  @ApiProperty({})
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @ApiProperty()
  token: TokenDto;
}
