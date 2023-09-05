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
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    image: string;
    phone: string;
    code: string;
    password: string; 
  }

  export class UserCreateInput{
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    image: string;
    phone: string;
    password: string; 
  }


export function generateValidationCode(length: number = 6): string {
  const code = randomBytes(Math.ceil(length / 2))
    .toString('hex') 
    .slice(0, length); 

  return code;
}
