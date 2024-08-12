import { Body, Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import {
  CreateFileRequestBodyDto,
  CreateFileResponseDto,
} from './dtos/create-file.dto';
import {
  GenerateSignedUrlRequestBodyDto,
  GenerateSignedUrlRequestParamDto,
  GenerateSignedUrlResponseDto,
} from './dtos/generate-signed-url.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFileCommand, GenerateSignedUrlCommand } from './commands';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';

@Controller()
@ApiTags('File API')
export class FilesController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Post('/files/:fileId[:]generateSignedUrl')
  @Auth()
  @ApiOperation({
    summary: 'Generate Signed URL ',
    description: `[Cases] <br/>
    - Put: Create한 파일에 Object Upload 가능한 URL <br/>
    - Get: 파일에 권한이 있다면 Download 가능한 URL `,
  })
  @ApiResponse({ status: HttpStatus.OK, type: GenerateSignedUrlResponseDto })
  generateSignedUrl(
    @Body() body: GenerateSignedUrlRequestBodyDto,
    @Param() param: GenerateSignedUrlRequestParamDto,
    @RequestUser() requestUser,
  ) {
    return this.commandBus.execute(
      new GenerateSignedUrlCommand({ ...body, ...param }, requestUser),
    );
  }

  @Post('/files')
  @Auth()
  @ApiOperation({
    summary: 'Create File ',
    description: `[Note] <br/>
    * 해당 API로 파일 생성 후 generateSignedUrl Method를 호출하여 파일을 직접 PUT`,
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateFileResponseDto })
  createFile(
    @Body() body: CreateFileRequestBodyDto,
    @RequestUser() requestUser,
  ) {
    return this.commandBus.execute(
      new CreateFileCommand({ ...body }, requestUser),
    );
  }
}
