import { RequestUser } from '@hackathemy-qrmenu/type';
import {
  CreateFileRequestBodyDto,
  CreateFileResponseDto,
} from '../dtos/create-file.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from '../entities/file.entity';
import { Repository } from 'typeorm';
import { Account } from 'src/accounts/entities/account.entity';

export class CreateFileCommand {
  constructor(
    public request: CreateFileRequestBodyDto,
    public requestUser: RequestUser,
  ) {}
}

@CommandHandler(CreateFileCommand)
export class CreateFileCommandHandler
  implements ICommandHandler<CreateFileCommand, CreateFileResponseDto>
{
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async execute(command: CreateFileCommand): Promise<CreateFileResponseDto> {
    const { request, requestUser } = command;

    let file = this.fileRepository.create();

    file.contentType = request.contentType;
    file.fileName = request.fileName;
    file.createdBy = { id: requestUser.accountId } as Account;
    file.size = request.size;
    file.key = request.key;

    file = await this.fileRepository.save(file);

    return {
      file,
    };
  }
}
