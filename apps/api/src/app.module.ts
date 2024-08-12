import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { AppExceptionFilter } from './common/error/filters/exception.filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import validation from './config/validation';
import configuration from './config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AccountsModule } from './accounts/accounts.module';
import { FilesModule } from './files/files.module';
import { SellersModule } from './sellers/sellers.module';
import { CategoriesModule } from './menu/categories/categories.module';
import { MenusModule } from './menu/menus/menus.module';
import { ContentsModule } from './contents/contents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validation,
      load: [configuration],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('jwt.secret'),
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          ...(configService.get('database') as any),
          synchronize: true,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
    }),
    AccountsModule,
    FilesModule,
    CategoriesModule,
    SellersModule,
    MenusModule,
    ContentsModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
