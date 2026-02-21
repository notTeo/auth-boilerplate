import { Request, Response, NextFunction } from "express";
import { LoginDto, RegisterDto } from '../types/auth.types';
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/auth.service";
import { successResponse } from "../utils/response";
import { AppError } from "../middleware/errorHandler";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto: RegisterDto = req.body;
    const user = await registerUser(dto);
    successResponse(res, {user}, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dto: LoginDto = req.body;
    const { refreshToken, ...result } = await loginUser(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    });

    successResponse(res, result , 200);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new AppError(401, 'No refresh token provided');
    }

    const { accessToken, newRefreshToken } = await refreshAccessToken(token);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    successResponse(res, { accessToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await logoutUser(token);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    successResponse(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};