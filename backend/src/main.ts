import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('WinterArcBootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger OpenAPI Setup
  const config = new DocumentBuilder()
    .setTitle('Winter Arc — Discipline Challenge API')
    .setDescription(
      'REST API for Winter Arc personal discipline and 4-task daily habit tracking platform.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 Winter Arc Backend running on http://localhost:${port}`);
  logger.log(`📚 Swagger documentation available at http://localhost:${port}/api/docs`);
}

bootstrap();
