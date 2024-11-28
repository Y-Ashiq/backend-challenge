import { AppError } from "../util/AppError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    let { error } = schema.validate(req.body, { abortEarly: false });

    if (!error) {
      next();
    } else {
      let errorMessage = error.details.map((key) => key.message);
      next(new AppError(errorMessage, 401));
    }
  };
};
