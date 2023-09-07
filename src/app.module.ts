import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateUniqueFilename } from './utils';
import { UsersService } from './users/users.service';
import { MailerService } from './users/mailer.service';
import { ArticlesService } from './articles/articles.service';



@Module({
  imports: [ArticlesModule, UsersModule,
      PassportModule,
      JwtModule.register({
        secret: 'codesecrete', 
        signOptions: { expiresIn: '120h' }, 
      }),
      MulterModule.register({
        storage: diskStorage({
          destination: './assets/images/profiles', 
          filename: (req, file, cb) => {
            const uniqueFilename = generateUniqueFilename(file.originalname); 
            console.log(uniqueFilename);
            cb(null, `${uniqueFilename}`);
          },
        }),
      }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtStrategy, UsersService, MailerService,ArticlesService],
})
export class AppModule {}
