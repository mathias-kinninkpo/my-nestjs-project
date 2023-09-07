// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const server = express(); 

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server), 
  );

  console.log(path.join(__dirname, '..'))
  app.use('.', express.static(path.join(__dirname, '..')));
  const config = new DocumentBuilder()
  .setTitle('Articles API')
  .setDescription('API de gestion des articles')
  .setVersion('1.0')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();



