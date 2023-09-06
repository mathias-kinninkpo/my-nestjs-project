// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const server = express(); // Créez une instance d'Express

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server), // Utilisez l'adaptateur Express pour Nest.js
  );

  console.log(path.join(__dirname, '..'))
  server.use('..', express.static(path.join(__dirname, '..')));

  await app.listen(3000);
}
bootstrap();
