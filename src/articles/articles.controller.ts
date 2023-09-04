// import { Controller } from '@nestjs/common';

// @Controller('articles')
// export class ArticlesController {}

// src/articles/articles.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/articles.dto';

@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('articles')
  async create(@Body() createArticleDto: CreateArticleDto) {
    try {
      const article = await this.articlesService.create(createArticleDto);
      return article;
    } catch (error) {
      throw new HttpException('Could not create article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('articles')
  async findAll() {
    try {
      const articles = await this.articlesService.findAll();
      return articles;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('articles/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const article = await this.articlesService.findOne(id);
      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not fetch article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('articles/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: CreateArticleDto) {
    try {
      const article = await this.articlesService.update(id, updateArticleDto);
      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not update article', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('articles/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const article = await this.articlesService.remove(id);
      if (!article) {
        throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
      }
      return article;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not delete article or Article not found', HttpStatus.NOT_FOUND);
    }
  }
  @Get('/public/articles')
  async public() {
    try {
      const articles = await this.articlesService.public();
      return articles;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Get('/private/articles')
  async private() {
    try {
      const articles = await this.articlesService.private();
      return articles;
    } catch (error) {
      console.log(error);
      throw new HttpException('Could not fetch articles', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
