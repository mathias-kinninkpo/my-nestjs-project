// users/users.service.ts
import { Injectable, UnauthorizedException , HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserCreate, UserCreateInput, generateValidationCode } from './users.model';
import { MailerService } from './mailer.service';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService
    ) {}

  async create(data: UserCreateInput) {

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const code = generateValidationCode(8)

    const user: UserCreate = {
      ...data,
      password: hashedPassword,
      code : code,
    };

    const _user = this.prisma.user.create({ 
       data: user
    });
    if (_user && this.sendValidationEmail((await _user).email, (await _user).code)){

        return {
            message : "user created and email sent successfully",
            code: (await _user).code,
        }
    }
    throw new HttpException("An error occured", 400)

  }




  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email : email } });
  }




  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id: id } });
  }




  async comparePasswords(plainTextPassword: string, hashedPassword: string) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }




  async login(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await this.comparePasswords(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user);

    // Retournez le token JWT
    console.log(token);
    return await { token : token };
  }




  async generateToken(user: User) {
    const payload = {
      sub: user.id, 
      email: user.email, 
    };

    const options = {
      expiresIn: '1d',
    };
    const token = jwt.sign(payload, 'codesecret', options);

    return token;
  }





  async sendValidationEmail(email: string, validationCode: string) {
    // Construisez le contenu de l'e-mail de validation
    const mailOptions = {
      from: '0dc70c4667bbe7',
      to: email,
      subject: 'Confirmation de l\'adresse e-mail',
      text: `Votre code de validation est : ${validationCode}`,
    };
    await this.mailerService.sendMail(mailOptions);
  }




  async verifyRegistration(email: string, code : string){
    const _user = await this.findByEmail(email);
    if (_user.code === code) {
        return {
            message : "Verified registration"
        }
    }
    else {
        throw new UnauthorizedException('The verification code is invalid');
    }
  }



  async uptadeUser(id: number, data : UserCreateInput){
    const _user = await this.findById(id);
    if (_user){
        this.prisma.user.update({
            where : {id: _user.id},
            data : data
        })
    }
  }


  async readUser(id: number){
    return await this.prisma.user.findUnique({
        where: {id : id},
    })
  }

}

