import { ApiProperty } from '@nestjs/swagger';
import { AccountDto } from './account.dto';
import {
  ApiPropertyResource,
  ApiPropertyUpdateMask,
} from 'src/common/internal/decorators/api-property.decorator';

export class PatchAccountRequestParamDto {
  @ApiProperty({ description: 'Target Account' })
  accountId: string;
}

export class PatchAccountRequestBodyDto {
  @ApiPropertyResource()
  account: AccountDto;

  @ApiPropertyUpdateMask()
  updateMask: string;
}

export class PatchAccountResponseDto {
  @ApiPropertyResource()
  account: AccountDto;
}
