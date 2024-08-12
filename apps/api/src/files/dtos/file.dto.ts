import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({})
  id: number;

  @ApiProperty()
  size: number;

  @ApiProperty()
  key: string;
  
  @ApiProperty()
  fileName: string;

  @ApiProperty()
  contentType: string;
}
