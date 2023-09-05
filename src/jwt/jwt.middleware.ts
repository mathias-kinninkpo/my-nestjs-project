// jwt.middleware.ts
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req?.headers?.authorization?.replace('Bearer ', ''); 
  console.log(token)
  if (!token) {
    return res?.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, 'codesecret'); 
    req.body = decoded; 
    next();
    console.log(decoded)
    return decoded; 
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
