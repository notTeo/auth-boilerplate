import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { LoginDto, RegisterDto } from '../types/auth.types';
import { logger } from '../utils/logger';
import { signAccessToken } from '../utils/jwt';

export const registerUser = async ({ email, password }: RegisterDto) => {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    logger.warn(`Registration attempt with existing email: ${email}`);
    throw new AppError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      isVerified: true,
      createdAt: true,
    },
  });
  
  logger.info(`New user registered: ${user.email}`);
  return user;
};

export const loginUser = async ({ email, password }: LoginDto) => {
  const user = await prisma.user.findUnique({
    where: {email},
  })

  if(!user){
    throw new AppError(401, 'Invalid credentials')
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);

  if(!isPasswordValid){
    throw new AppError(401, 'Invalid credentials')
  }

  const accessToken = signAccessToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    accessToken,
  };
};