import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateFileResponseDto } from './dtos/create-file.dto';
import { CommandBus } from '@nestjs/cqrs';
import { RequestUser } from 'src/auth/decorators/request-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileCommand } from './commands/create-file.command';

@Controller()
@ApiTags('File API')
export class FilesController {
  constructor(private commandBus: CommandBus) {}

  @Post('/files')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload File',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: CreateFileResponseDto })
  createFile(
    @RequestUser() requestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.commandBus.execute(
      new CreateFileCommand(
        {
          size: file.size,
          contentType: file.mimetype,
          fileName: file.originalname,
          key: file.path,
        },
        requestUser,
      ),
    );
  }
}
