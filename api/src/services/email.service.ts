import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const resend = new Resend(env.resend.apiKey);

export const sendVerificationEmail = async (
  email: string,
  token: string,
) => {
  const verificationUrl = `${env.clientUrl}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: env.resend.emailFrom,
    to: email,
    subject: 'Verify your email',
    html: `
      <h2>Welcome!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  if (error) {
    logger.error(error, `Failed to send verification email to ${email}`);
    throw new Error('Failed to send verification email');
  }

  logger.info(`Verification email sent to ${email}`);
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetUrl = `${env.clientUrl}/reset-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: env.resend.emailFrom,
    to: email,
    subject: 'Reset your password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, ignore this email.</p>
    `,
  });

  if (error) {
    logger.error(error, `Failed to send reset email to ${email}`);
    throw new Error('Failed to send password reset email');
  }

  logger.info(`Password reset email sent to ${email}`);
};