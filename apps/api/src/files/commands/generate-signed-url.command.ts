import { RequestUser } from '@hackathon/type';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  GenerateSignedUrlRequestBodyDto,
  GenerateSignedUrlRequestParamDto,
  GenerateSignedUrlResponseDto,
} from '../dtos/generate-signed-url.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { Repository } from 'typeorm';
import { AwsS3Service } from 'src/common/aws/services/s3.service';
import { CommonError, throwError } from 'src/common/error';

export class GenerateSignedUrlCommand {
  constructor(
    public request: GenerateSignedUrlRequestBodyDto &
      GenerateSignedUrlRequestParamDto,
    public requestUser: RequestUser,
  ) {}
}

@CommandHandler(GenerateSignedUrlCommand)
export class GenerateSignedUrlCommandHandler
  implements
    ICommandHandler<GenerateSignedUrlCommand, GenerateSignedUrlResponseDto>
{
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    private awsS3Service: AwsS3Service,
  ) {}

  async execute(
    command: GenerateSignedUrlCommand,
  ): Promise<GenerateSignedUrlResponseDto> {
    const { request, requestUser } = command;

    const file = await this.fileRepository.findOne({
      where: {
        id: parseInt(request.fileId),
      },
      relations: { createdBy: true },
    });

    if (requestUser.accountId !== file.createdBy.id) {
      throwError(CommonError.ERR_FORBIDDEN);
    }

    const signedUrl = await this.awsS3Service.genSignedUrl({
      key: file.key,
      method: request.method,
    });

    return {
      signedUrl,
    };
  }
}
