import { ApiProperty } from '@nestjs/swagger';
import { SignedUrlMethod } from '../types';

export class GenerateSignedUrlRequestParamDto {
  @ApiProperty()
  fileId: string;
}

export class GenerateSignedUrlRequestBodyDto {
  @ApiProperty({ enum: SignedUrlMethod })
  method: SignedUrlMethod;
}

export class GenerateSignedUrlResponseDto {
  @ApiProperty({ description: 'AWS S3 Signed URL' })
  signedUrl: string;
}
