import { ApiProperty } from '@nestjs/swagger';

export class PutContentMenusRequestParamDto {
  @ApiProperty()
  contentId: string;
}

export class PutContentMenusRequestBodyDto {
  @ApiProperty({ isArray: true })
  menusIds: number[];
}

export class PutContentMenusResponseDto {}
