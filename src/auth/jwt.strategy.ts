// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


const options = {
  authScheme : 'bearer',
  tokenBodyField : 'authorization',
  tokenQueryParameterName : 'authorization'
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 
   
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.versionOneCompatibility(options),
      ignoreExpiration: false,
      secretOrKey: 'codesecret', 
    });
    console.log("ici c'est token", ExtractJwt.versionOneCompatibility(options))
  }

  
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email }; 
  }
}
