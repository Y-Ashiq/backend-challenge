import sequelize from "../DBconnection.js";
import { DataTypes } from "sequelize";

const userSchema = sequelize.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM,
    values: ["user", "admin"],
    defaultValue: "user",
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  logInCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
},
});

export default userSchema;
