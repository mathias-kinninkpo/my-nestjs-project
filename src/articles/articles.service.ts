// src/articles/articles.service.ts
import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string, image: string, short_description: string, description: string, author: string}) {
    return this.prisma.article.create({
      data: {
        ...data,
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

  async update(id: number, data: { title: string, image: string, short_description: string, description: string, author: string}) {
    return this.prisma.article.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async remove(id: number) {
    var article   = this.findOne(id);
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
