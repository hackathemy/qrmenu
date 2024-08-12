import { ApiParam, ApiProperty } from '@nestjs/swagger';
import { FileDto } from 'src/files/dtos/file.dto';

export class PutMenuImagesRequestParamDto {
  @ApiProperty()
  menuId: string;
}

export class PutMenuImagesRequestBodyDto {
  @ApiProperty({ isArray: true, type: Number })
  imageFileIds: number[];
}

export class PutMenuImagesResponseDto {}
