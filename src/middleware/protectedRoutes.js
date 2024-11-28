import jwt from "jsonwebtoken";
import userSchema from "../../database/model/user.model.js";
import { handleError } from "./handleError.js";
import { AppError } from "../util/AppError.js";

export const protectedRoutes = handleError(async (req, res, next) => {
  let { token } = req.headers;
  
  if (!token) return next(new AppError("invalid token", 404));
  
  let decoded = jwt.verify(token, "mysecrettoken");
  
  let isExist = await userSchema.findOne({ where: { id: decoded.id } });

  if (!isExist) return next(new AppError("user not found", 404));

  req.user = isExist;
  next();
});
