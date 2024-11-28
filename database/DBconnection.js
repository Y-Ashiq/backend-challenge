import { Sequelize } from "sequelize";

const sequelize = new Sequelize("user_management", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => {
    console.log("error" + error.errors);
  });

export default sequelize;