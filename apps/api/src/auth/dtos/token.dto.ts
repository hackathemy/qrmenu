import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ description: 'Access Token (1H)' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh Token (14D)' })
  refreshToken: string;
}
