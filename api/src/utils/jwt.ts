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

export const signRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.jwt.refreshExpiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign({ userId }, env.jwt.refreshSecret, options);
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.jwt.refreshSecret) as { userId: string };
};

export const getRefreshTokenExpiry = (): Date => {
  const days = parseInt(env.jwt.refreshExpiresIn.replace('d', ''));
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);
  return expiry;
};