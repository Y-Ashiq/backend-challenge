import express from "express";
import sequelize from "./database/DBconnection.js";
import { BootStrap } from "./src/modules/bootstarp.js";
const app = express();
const port = 3000;

sequelize.sync();
app.use(express.json());

BootStrap(app);

app.use("**", (req, res, next) => {
  next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: "error", error: err.message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
