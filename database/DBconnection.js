import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

import "dotenv/config";

const sequelize = new Sequelize(
  "sql8750099",
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

export default sequelize;
