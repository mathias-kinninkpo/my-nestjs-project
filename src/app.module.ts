import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './articles/articles.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [ArticlesModule, UsersModule,
      PassportModule,
      JwtModule.register({
        secret: 'codesecrete', 
        signOptions: { expiresIn: '120h' }, 
      }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtStrategy],
})
export class AppModule {}
