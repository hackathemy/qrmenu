import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonError, newError } from './common/error';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  app.useStaticAssets(join(__dirname, '..', 'upload'), { prefix: '/upload/' });

  /** Bad request error middleware */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors) => {
        return newError(
          CommonError.ERR_BAD_REQUEST,
          errors.reduce(
            (p, c) =>
              p +
              (p ? '&' : '') +
              Object.values(c.constraints)
                .map((message) => `${c.property}=${message}`)
                .join('&'),
            '',
          ),
        );
      },
    }),
  );

  /** Swagger */
  const config = new DocumentBuilder()
    .setTitle('Hackathon Backend')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(configService.get('port') as number);
}
bootstrap();
