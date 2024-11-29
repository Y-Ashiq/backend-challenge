import { Router } from "express";

import userControllers from "./user.controller.js";
import { userValidation } from "./user.validation.js";
import { validation } from "../../middleware/validate.js";
import { protectedRoutes } from "../../middleware/protectedRoutes.js";
import { allowTo } from "../../middleware/allowTo.js";

const userRouter = Router();

/**
 user registration route
 */
userRouter.post(
  "/register",
  validation(userValidation),
  userControllers.register
);

/**
 user login route
 */
userRouter.post("/signin", userControllers.signIn);

/**
 verify user route
 */

userRouter.post("/verifyuser", userControllers.verifyUser);

/**
 CRUD operations on specific user route with admin privilege
 */
userRouter
  .route("/getUser/:id", protectedRoutes, allowTo("admin"))
  .get(userControllers.getUser)
  .put(userControllers.updateUser)
  .delete(userControllers.deleteUser);

/**
get all users route with admin privilege
 */

userRouter.get(
  "/getUsers",
  protectedRoutes,
  allowTo("admin"),
  userControllers.getAllUsers
);

/**
top three users route
 */

userRouter.get("/top3", userControllers.topThree);

/**
inactive users route
 */
userRouter.get("/inactiveUsers", userControllers.inactiveUsers);

export default userRouter;
