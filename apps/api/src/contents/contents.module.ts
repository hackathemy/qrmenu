import { Module } from '@nestjs/common';
import { ContentTranslate } from './entities/content-translate.entity';
import { Content } from './entities/content.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { ContentMenu } from './entities/content-menu';
import { MenusModule } from 'src/menu/menus/menus.module';

@Module({
  imports: [
    CqrsModule,
    MenusModule,
    TypeOrmModule.forFeature([ContentTranslate, Content, ContentMenu]),
  ],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
