// users/users.controller.ts
import { Controller, Post, Body, Get, Res, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateInput } from './users.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateUniqueFilename } from 'src/utils';
import * as path from 'path';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post("register")
  @UseInterceptors(FileInterceptor("image",{
    storage : diskStorage({
      destination: './assets/images/profiles', 
      filename: (req, file, cb) => {
        const uniqueFilename = generateUniqueFilename(file.originalname); 
        cb(null, `${uniqueFilename}`);
      },
    }),}

  )
)
  async register(@Body() user : UserCreateInput, @UploadedFile() image){
    return this.usersService.create(user, image)
  }

  @Post("register/verify")
  async verifyRegistration(@Body() info : {email: string, code: string}){
    return this.usersService.verifyRegistration(info.email, info.code);
  }


  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    const result = await this.usersService.login(loginDto.email, loginDto.password);

    return result;
  }

  @Put('users/:id')
  async update(@Param('id', ParseIntPipe) id : number, @Body() user : UserCreateInput){
    return this.usersService.uptadeUser(id, user);
  }

  @Get('/users/:id')
  async read(@Param('id', ParseIntPipe) id : number){
    return this.usersService.readUser(id)

  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: { email: string }) {
    return this.usersService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('forgot-password/verify')
  async forgotPasswordVerify(@Body() forgotPasswordDto: { email: string, code: string }) {
    
    return this.usersService.forgotPasswordVerify(forgotPasswordDto.email, forgotPasswordDto.code);

  }

  @Get('users/:id/articles')
  async findArticlesByUser(@Param('id', ParseIntPipe) id : number){

    return this.usersService.findArticlesByUser(id)
  }
  // @Get(':filename')
  // async serveImage(@Param('filename') filename: string, @Res() res: Response) {
  //   // Assurez-vous que le chemin pointe vers le répertoire où sont stockées vos images de profil
  //   const imagePath = path.join(__dirname, '../path/vers/votre/repertoire/images', filename);
    
  //   // Utilisez la méthode res.sendFile pour renvoyer le fichier au client
  //   res.sendFile(imagePath);

  // }


 
}
