import userRouter from "./userModule/user.routes.js";

export const BootStrap = (app) => {
  app.use("/api/v1/user", userRouter);
};
