import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const signAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.jwt.accessExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign({ userId }, env.jwt.accessSecret, options);
};

export const verifyAccessToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.jwt.accessSecret) as { userId: string };
};