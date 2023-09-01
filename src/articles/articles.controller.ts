// import { Controller } from '@nestjs/common';

// @Controller('articles')
// export class ArticlesController {}

// src/articles/articles.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/articles.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    try {
      const article = await this.articlesService.create(createArticleDto);
      return article;
    } catch (error) {
      throw new HttpException('Could not create article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const articles = await this.articlesService.findAll();
      return articles;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const article = await this.articlesService.findOne(id);
      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      throw new HttpException('Could not fetch article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: CreateArticleDto) {
    try {
      const article = await this.articlesService.update(id, updateArticleDto);
      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      throw new HttpException('Could not update article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const article = await this.articlesService.remove(id);
      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      throw new HttpException('Could not delete article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
