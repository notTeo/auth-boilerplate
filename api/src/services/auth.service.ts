import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { LoginDto, RegisterDto } from '../types/auth.types';
import { logger } from '../utils/logger';
import { getRefreshTokenExpiry, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';

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
    logger.warn(`Login attempt with existing email: ${email}`);
    throw new AppError(401, 'Invalid credentials')
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash!);

  if(!isPasswordValid){
    logger.warn(`Failed login attempt for: ${email}`);
    throw new AppError(401, 'Invalid credentials')
  }

  const accessToken = signAccessToken(user.id);
  const refreshToken = signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  logger.info(`User logged in: ${user.email}`);

  return {
    user: {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (token:string) => {
  let payload: { userId: string };
  try {
    payload = verifyRefreshToken(token)
  } catch (error) {
    throw new AppError(401, 'Invalid refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if(!stored || stored.expiresAt < new Date()){
    throw new AppError(401, 'Refresh token expired or not found');
  }

  await prisma.refreshToken.delete({
    where: { token },
  });

  const newRefreshToken = signRefreshToken(payload.userId);

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const accessToken = (payload.userId);

  logger.info(`Access token refreshed for userId: ${payload.userId}`);

  return { accessToken, newRefreshToken };

}

export const logoutUser = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });

  logger.info('User logged out');
};