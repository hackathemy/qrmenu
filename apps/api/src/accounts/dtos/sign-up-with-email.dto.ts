import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from 'src/auth/dtos/token.dto';

export class SignUpWithEmailRequestBodyDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ description: 'Email Auth  ID' })
  authId: number;

  @ApiProperty({ nullable: true })
  password: string | null;
}

export class SignUpWithEmailResponseDto {
  @ApiProperty()
  token: TokenDto;
}
