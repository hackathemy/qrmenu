import { AccountStatus } from '@hackathon-qrmenu/type';
import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty()
  id: number;

  @ApiProperty({
    description: 'Email (if register with email)',
  })
  email: string;

  @ApiProperty({})
  createdAt: Date;

  @ApiProperty({})
  phoneNumber:string | null;

  @ApiProperty({})
  status: AccountStatus;
}
