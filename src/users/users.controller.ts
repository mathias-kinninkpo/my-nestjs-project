// users/users.controller.ts
import { Controller, Post, Body, Get, Res, Put, Param, ParseIntPipe, UseInterceptors, UploadedFile} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateInput } from './users.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { generateUniqueFilename } from 'src/utils';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { loginDto, passwordForgotDto, passwordVerifyDto } from 'src/articles/dto/articles.dto';

@Controller()
@ApiTags('Les actions sur les utilisateurs')
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
 @ApiConsumes('multipart/form-data')
  async register(@Body() user : UserCreateInput, @UploadedFile() image){
    return this.usersService.create(user, image)
  }



  @Post("register/verify")
  async verifyRegistration(@Body() info : passwordVerifyDto){
    return this.usersService.verifyRegistration(info.email, info.code);
  }



  // login user
  @Post('login')
  async login(@Body() loginDto: loginDto) {
    const result = await this.usersService.login(loginDto.email, loginDto.password);

    return result;
  }

  // update user
  @Put('users/:id')
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
 @ApiConsumes('multipart/form-data')
  async update(@Param('id', ParseIntPipe) id : number, @Body() user : UserCreateInput, @UploadedFile() image :  Express.Multer.File){
    return this.usersService.uptadeUser(id, user, image);
  }


  // get a user 
  @Get('/users/:id')
  async read(@Param('id', ParseIntPipe) id : number){
    return this.usersService.readUser(id)

  }

  // send code when the password has been forgotten
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: passwordForgotDto) {
    console.log(forgotPasswordDto)
    return this.usersService.forgotPassword(forgotPasswordDto.email);
  }



  // verify password by code before updating
  @Post('forgot-password/verify')
  async forgotPasswordVerify(@Body() forgotPasswordDto: passwordVerifyDto) {
    
    return this.usersService.forgotPasswordVerify(forgotPasswordDto.email, forgotPasswordDto.code);

  }

  // get articles by a user 
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
