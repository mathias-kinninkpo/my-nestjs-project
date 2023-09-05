import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MailerService } from './mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PrismaService, UsersService, MailerService],
  controllers: [UsersController]
})
export class UsersModule {}
