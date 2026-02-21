import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { RegisterDto } from '../types/auth.types';
import { logger } from '../utils/logger';

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