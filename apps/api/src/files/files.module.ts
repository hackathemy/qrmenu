import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { COMMAND_HANDLERS } from './commands';
import { AwsModule } from 'src/common/aws/aws.module';

@Module({
  imports: [CqrsModule, AwsModule, TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [...COMMAND_HANDLERS],
})
export class FilesModule {}
