import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from './file.dto';

export class CreateFileRequestBodyDto {
  @ApiProperty()
  size: number;

  @ApiProperty()
  fileName: string;

  @ApiProperty()
  contentType: string;

  key:string
}

export class CreateFileResponseDto {
  @ApiProperty()
  file: FileDto;
}
