// src/articles/dto/create-article.dto.ts
import { IsString, IsNotEmpty, isNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import exp from 'constants';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty({
    type: 'string', 
    format: 'binary' 
 })
  image: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  short_description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  author: string;
}

export class loginDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  password: string;

}

export class passwordVerifyDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  code: string;

}

export class passwordForgotDto{
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;
}