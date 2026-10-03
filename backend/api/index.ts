import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import express, { Request, Response } from 'express';

const server = express();
let isAppInitialized = false;

async function bootstrapServerless(): Promise<express.Express> {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );

  // Configure CORS using FRONTEND_URL from environment with safe local fallbacks
  const frontendUrl = process.env.FRONTEND_URL;
  const allowedOrigins: string[] = [
    'http://localhost:8081',
    'http://localhost:3000',
    'http://localhost:19006',
    'http://localhost:8080',
    'http://127.0.0.1:8081',
  ];

  if (frontendUrl) {
    const cleanFrontendUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;
    allowedOrigins.push(cleanFrontendUrl);
    allowedOrigins.push(`${cleanFrontendUrl}/`);
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(null, true);
    },
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

  await app.init();
  return server;
}

export default async function handler(req: Request, res: Response) {
  if (!isAppInitialized) {
    await bootstrapServerless();
    isAppInitialized = true;
  }
  server(req, res);
}
