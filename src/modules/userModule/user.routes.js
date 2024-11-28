import { Router } from "express";

import userControllers from "./user.controller.js";
import { userValidation } from "./user.validation.js";
import { validation } from "../../middleware/validate.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";

const userRouter = Router();

userRouter.post(
  "/register",
  validation(userValidation),
  userControllers.register
);
userRouter.post("/signin", userControllers.signIn);
userRouter.post("/verifyuser", userControllers.verifyUser);

userRouter
  .route("/:id")
  .put(userControllers.updateuser)
  .delete(userControllers.deleteUser);

userRouter.get(
  "/getUsers/:id",
  protectedRoutes,
  allowTo("admin"),
  userControllers.getUser
);
userRouter.get("top3",userControllers.topThree)

export default userRouter;
