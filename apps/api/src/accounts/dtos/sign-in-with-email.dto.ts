import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from 'src/auth/dtos/token.dto';

export class SignInWithEmailRequestBodyDto {
  @ApiProperty({})
  email: string;

  @ApiProperty({})
  password: string;
}

export class SignInWithEmailResponseDto {
  @ApiProperty({})
  token: TokenDto;
}
