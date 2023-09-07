// src/articles/articles.service.ts
import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateArticleDto } from './dto/articles.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateArticleDto, image : Express.Multer.File) {
    return this.prisma.article.create({
      data: {
        ...data,
        image : image.path ? image.path : "image.png",
      },
    });
  }

  async findAll() {
    return (await this.prisma.article.findMany()).filter((article) => article.deleted_at === null);
  }

  async findOne(id: number) {
    return this.prisma.article.findUnique({
      where: {
        id : id,
        deleted_at : null
      },
    });
  }

  async update(id: number, data: CreateArticleDto, image) {

    var img = ""

    const article = await this.findOne(id)
    if (image && image.originalname && image.path){
      img = image.path
    }

   if (article){

     img = img === "" ? article.image : img

     return this.prisma.article.update({
       where: {
         id,
       },
       data: {
         ...data,
         image : img
       },
     });
   }
   throw new HttpException("Article not found",404)
  }

  async remove(id: number) {
    var article   = await this.findOne(id);
    return this.prisma.article.update({
      where: {
        id,
      },
      data: {
        ...article,
        deleted_at : new Date()
      }
    });
  }

  async public(){
    return (await this.findAll()).filter(article => article.is_public === true)
  }

  async private(){
    return (await this.findAll()).filter(article => article.is_public === false)
  }
}
