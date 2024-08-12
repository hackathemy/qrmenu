import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from './account.dto';
import { ApiPropertyResource } from 'src/common/internal/decorators/api-property.decorator';

export class GetAccountRequestParamDto {
  @ApiProperty({ description: 'Target Account' })
  accountId: string;
}

export class GetAccountResponseDto {
  @ApiPropertyResource()
  account: AccountDto;
}
