// src/articles/articles.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string, image: string, short_description: string, description: string, author: string, is_public: boolean }) {
    return this.prisma.article.create({
      data: {
        ...data,
      },
    });
  }

  async findAll() {
    return this.prisma.article.findMany();
  }

  async findOne(id: number) {
    return this.prisma.article.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: { title: string, image: string, short_description: string, description: string, author: string, is_public: boolean }) {
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
    return this.prisma.article.delete({
      where: {
        id,
      },
    });
  }
}
