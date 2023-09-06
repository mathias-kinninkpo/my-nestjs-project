// users/users.service.ts
import { Injectable, UnauthorizedException , HttpException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma,} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserCreate, UserCreateInput, generateValidationCode } from './users.model';
import { MailerService } from './mailer.service';
import * as jwt from 'jsonwebtoken'
import { ArticlesService } from 'src/articles/articles.service';
import * as sharp from 'sharp'
import * as fs from 'fs'
import { extname } from 'path';


@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly articlesService: ArticlesService
    ) {}


  generateUniqueFilename(filename) {
    const randomBytes =  Math.round(Math.random() * 1e9)
    const timestamp = Date.now();
    return `${filename}${timestamp}${randomBytes}${extname(filename)}`;
  }


  async create(data: UserCreateInput, image ) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const code = generateValidationCode(8);

    // const resizedImage = await sharp(image.buffer)
    //   .resize({ width: 200, height: 200 })
    //   .toBuffer();

    // const storagePath = './assets/images/profile'; 
    // if (!fs.existsSync(storagePath)) {
    //   fs.mkdirSync(storagePath, { recursive: true });
    // }

    // const imagePath = `${storagePath}/${uniqueFilename}`;
    // fs.writeFileSync(imagePath, resizedImage);

    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        code : code,
        image : image.path ? image.path : "image.jpg"
      },
    });

    if (user && this.sendValidationEmail(user.email, code)) {
      return {
        message: 'User created and email sent successfully',
        code,
      };
    }

    throw new HttpException('An error occurred', 400);
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




  async generateToken(user) {
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
    var hashedPassword = _user.password
    const x = await this.comparePasswords(data.password, hashedPassword)
    console.log(x)
    if ((!this.comparePasswords(data.password, hashedPassword)) && (data.password !== hashedPassword)){

       hashedPassword = await bcrypt.hash(data.password, 10);
      
    }
    if (_user){
        return this.prisma.user.update({
            where : {id: _user.id},
            data : {...data, password : hashedPassword}
        })
        
    }
    throw new HttpException("User not found", 404)
  }


  async readUser(id: number){
    return await this.prisma.user.findUnique({
        where: {id : id},
    })
  }


  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const verificationCode = generateValidationCode(8);

    const _user = { ...user, code: verificationCode };

    if (this.uptadeUser(user.id, _user)) {

      await this.sendValidationEmail(email, verificationCode);
      return { message: 'Verification code sent successfully' };
    }
    throw new HttpException('An error occured', 400)  


  }


  async forgotPasswordVerify(email: string, verificationCode: string) {
    
    const user = await this.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.code !== verificationCode) {
      throw new UnauthorizedException('Invalid verification code');
    }
    const _user = {...user, code: null}
    this.uptadeUser(user.id, _user);

    return { message: 'code veried successfully, you can now reset your password' };

  }

  async findArticlesByUser(id: number){
    const _user = await this.findById(id);

    if (!_user){
      throw new HttpException('User not found', 404)
    }
    
    const articles = (await this.articlesService.findAll()).filter(article => (article.author === _user.email || article.author === _user.username))

    return articles
  }


}




