// users/users.controller.ts
import { Controller, Post, Body, Get, Put, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserCreateInput } from './users.model';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post("register")
  async register(@Body() user : UserCreateInput){
    return this.usersService.create(user)
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


 
}
