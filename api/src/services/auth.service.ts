import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { LoginDto, RegisterDto } from '../types/auth.types';
import { logger } from '../utils/logger';
import { generateRandomToken, getEmailTokenExpiry, getPasswordResetTokenExpiry, getRefreshTokenExpiry, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendPasswordResetEmail, sendVerificationEmail } from './email.service';

export const registerUser = async ({ email, password }: RegisterDto) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    logger.warn(`Registration attempt with existing email: ${email}`);
    throw new AppError(409, 'Email already in use');
  }

  const existingPending = await prisma.pendingRegistration.findUnique({
    where: { email },
  });
  if (existingPending) {
    await prisma.pendingRegistration.delete({ where: { email } });
  }

  const passwordHash = await bcrypt.hash(password, 12);


  const token = generateRandomToken();


  await prisma.pendingRegistration.create({
    data: {
      email,
      passwordHash,
      token,
      expiresAt: getEmailTokenExpiry(),
    },
  });


  await sendVerificationEmail(email, token);

  logger.info(`Pending registration created for: ${email}`);
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

  const deleted = await prisma.refreshToken.deleteMany({
    where: { token },
  });

  if (deleted.count === 0) {
    throw new AppError(401, 'Refresh token already used');
  }

  const newRefreshToken = signRefreshToken(payload.userId);

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: payload.userId,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  const accessToken = signAccessToken(payload.userId);

  logger.info(`Access token refreshed for userId: ${payload.userId}`);

  return { accessToken, newRefreshToken };

}

export const logoutUser = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token },
  });

  logger.info('User logged out');
};

export const verifyEmail = async (token: string) => {

  const pending = await prisma.pendingRegistration.findUnique({
    where: { token },
  });

  if (!pending) {
    throw new AppError(400, 'Invalid verification token');
  }

  if (pending.expiresAt < new Date()) {
    await prisma.pendingRegistration.delete({ where: { token } });
    throw new AppError(400, 'Verification token expired');
  }

  const user = await prisma.user.create({
    data: {
      email: pending.email,
      passwordHash: pending.passwordHash,
      isVerified: true,
    },
    select: {
      id: true,
      email: true,
      isVerified: true,
      createdAt: true,
    },
  });

  await prisma.pendingRegistration.delete({ where: { token } });

  logger.info(`Email verified and user created: ${user.email}`);
  return user;
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    logger.warn(`Password reset attempt for non-existent email: ${email}`);
    return;
  }

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

  const token = generateRandomToken();

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: getPasswordResetTokenExpiry(),
    },
  });

  await sendPasswordResetEmail(email, token);

  logger.info(`Password reset token created for: ${email}`);
};

export const resetPassword = async (token: string, newPassword: string) => {

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new AppError(400, 'Invalid reset token');
  }

  if (resetToken.used) {
    throw new AppError(400, 'Reset token already used');
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    throw new AppError(400, 'Reset token expired');
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.update({
    where: { token },
    data: { used: true },
  });

  await prisma.refreshToken.deleteMany({
    where: { userId: resetToken.userId },
  });

  logger.info(`Password reset for userId: ${resetToken.userId}`);
};