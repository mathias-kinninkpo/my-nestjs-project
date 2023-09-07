import { ApiProperty } from '@nestjs/swagger';
import { randomBytes } from 'crypto';
// prisma/user.model.ts

// user.model.ts
export class User {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    image: string;
    phone: string;
    code: string;
    email_verified_at: Date;
    password: string; 
  }
  
  export class UserCreate{
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    image: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    code: string;
    @ApiProperty()
    password: string; 
  }

  export class UserCreateInput{
    @ApiProperty()
    firstname: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    email: string;
    @ApiProperty({
       type: 'string', 
       format: 'binary' 
    })
    image: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    password: string; 
  }


export function generateValidationCode(length: number = 6): string {
  const code = randomBytes(Math.ceil(length / 2))
    .toString('hex') 
    .slice(0, length); 

  return code;
}
