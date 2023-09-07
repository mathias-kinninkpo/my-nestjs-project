// auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';


const options = {
  authScheme : 'bearer',
  tokenBodyField : 'authorization',
  tokenQueryParameterName : 'authorization'
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 
   
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.versionOneCompatibility(options),
      ignoreExpiration: false,
      secretOrKey: 'codesecret', 
    });
    console.log("ici c'est token", ExtractJwt.versionOneCompatibility(options))
  }

  
  async validate(payload: any) {
    console.log("validate", payload)
    if (this.usersService.findByEmail(payload.email)){

      return { userId: payload.sub, email: payload.email }; 
    }
    throw new UnauthorizedException("Invalid token")

  }
}
