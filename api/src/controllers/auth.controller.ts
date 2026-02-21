import { Request, Response, NextFunction } from "express";
import { LoginDto, RegisterDto } from '../types/auth.types';
import { loginUser, registerUser } from "../services/auth.service";
import { successResponse } from "../utils/response";

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
    const result = await loginUser(dto);
    successResponse(res, result , 200);
  } catch (err) {
    next(err);
  }
};