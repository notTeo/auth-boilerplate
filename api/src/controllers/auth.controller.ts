import { Request, Response, NextFunction } from "express";
import { RegisterDto } from '../types/auth.types';
import { registerUser } from "../services/auth.service";
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