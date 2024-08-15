import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { COMMAND_HANDLERS } from './commands';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([File]),
    MulterModule.register({
      dest: 'upload',
      storage: diskStorage({
        destination: 'upload',
        filename(req, file, callback) {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [...COMMAND_HANDLERS],
})
export class FilesModule {}
