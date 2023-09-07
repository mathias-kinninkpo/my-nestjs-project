import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, HttpException, HttpStatus, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/articles.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiHeader, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateUniqueFilename } from 'src/utils';

@Controller()
@ApiTags('Les actions sur les articles')
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name : 'authorization',
  
})
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('articles')
  @UseInterceptors(FileInterceptor("image",{
    storage : diskStorage({
      destination: './assets/images/articles', 
      filename: (req, file, cb) => {
        const uniqueFilename = generateUniqueFilename(file.originalname); 
        cb(null, `${uniqueFilename}`);
      },
    }),}

  )
 )
 @ApiConsumes('multipart/form-data')
  async create(@Body() createArticleDto: CreateArticleDto, @UploadedFile() image : Express.Multer.File) {
    try {
      const article = await this.articlesService.create(createArticleDto, image);
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
  @UseInterceptors(FileInterceptor("image",{
    storage : diskStorage({
      destination: './assets/images/articles', 
      filename: (req, file, cb) => {
        const uniqueFilename = generateUniqueFilename(file.originalname); 
        cb(null, `${uniqueFilename}`);
      },
    }),}

  )
 )
 @ApiConsumes('multipart/form-data')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: CreateArticleDto,@UploadedFile() image) {
    try {
      const article = await this.articlesService.update(id, updateArticleDto, image);
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
