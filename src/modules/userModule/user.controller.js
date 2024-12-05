import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import xss from "xss";
import userSchema from "../../../database/model/user.model.js";
import { handleError } from "../../middleware/handleError.js";
import { AppError } from "../../util/AppError.js";
import { Op, Sequelize } from "sequelize";

/*
login endpoint where the token signed for the user and increase the login count for the statistics
*/
const signIn = handleError(async (req, res, next) => {
  let { email, password } = req.body;


  email = xss(email)
  password = xss(password)
  
  let isExist = await userSchema.findOne({ where: { email } });
  const isMatch = bcrypt.compareSync(password, isExist.password);

  if (isExist.verified) {
    if (isExist && isMatch) {
      let token = jwt.sign(
        { id: isExist.id, role: isExist.role },
        "mysecrettoken"
      );
      await userSchema.update(
        {
          logInCount: Sequelize.literal("logInCount + 1"),
          updatedAt: new Date(),
        },
        { where: { email } }
      );

      return res.json({ message: "welcome", token });
    }
  } else {
    next(new AppError("wrong email or password or not verified", 409));
  }
});

/*
register user endpoint with encrypt the use's password with bcrypt 
*/
const register = handleError(async (req, res, next) => {
  let { name, email, password } = req.body;

  name = xss(name);
  email = xss(email)
  password = xss(password)
  
  let isExist = await userSchema.findOne({ where: { email } });

  if (isExist) return next(new AppError("this user is already exist", 409));

  password = bcrypt.hashSync(password, 5);
  await userSchema.create({ name, email, password });

  res.json({ message: "user created successfully" });
});

/*
user verification
*/
const verifyUser = handleError(async (req, res, next) => {
  let { email } = req.body;

  let isExist = await userSchema.findOne({ where: { email } });

  if (isExist.verified == true)
    return next(new AppError("this user is already verified", 409));

  await userSchema.update({ verified: true }, { where: { email } });

  res.json({ message: "user created successfully" });
});

/*
get specific user with admin privilege
*/
const getUser = handleError(async (req, res, next) => {
  const id = req.params.id;

  let isExist = await userSchema.findOne({ where: { id } });

  if (!isExist) return next(new AppError("no records", 404));

  res.status(200).json({ user: isExist });
});

/*
update specific user with admin privilege
*/
const updateUser = handleError(async (req, res, next) => {
  const id = req.params.id;

  let isExist = await userSchema.findOne({ where: { id } });

  if (!isExist) {
    return next(new AppError("no records", 404));
  } else {
    await userSchema.update(req.body, {
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "user updated successfully" });
  }
});

/*
delete specific user with admin privilege
*/
const deleteUser = handleError(async (req, res, next) => {
  const id = req.params.id;

  let isExist = await userSchema.findOne({ where: { id } });

  if (!isExist) {
    return next(new AppError("no records", 404));
  } else {
    await userSchema.destroy({ where: { id } });

    res.status(200).json({ message: "user deleted successfully" });
  }
});

/*
get all users with filtration and pagination
*/

const getAllUsers = handleError(async (req, res, next) => {
  let page = req.query.page * 1 || 1;
  let skip = (page - 1) * 5 || 0;

  if ("filter" in req.query) {
    let users = await userSchema.findAll({
      limit: 5,
      offset: skip,
      where: {
        [Op.or]: {
          name: req.query.filter,
          email: req.query.filter,
        },
      },
    });
    res.json(users);
  } else if ("verified" in req.query) {
    let users;

    req.query.verified instanceof Boolean
      ? (users = await userSchema.findAll({
          limit: 5,
          offset: skip,
          where: {
            verified: req.query.verified,
          },
        }))
      : next(new AppError("invalid input", 400));

    users ? res.json(users) : next(new AppError("no record", 404));
  } else {
    let users = await userSchema.findAll();

    const result = await userSchema.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("*")), "totalUsers"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal("CASE WHEN verified = true THEN 1 ELSE 0 END")
          ),
          "verifiedUsers",
        ],
      ],
      raw: true,
    });

    res.json({ result, users });
  }
});

/*

endpoint to calculate the top 3 users or more frequent user you can change the limit number 
*/
const topThree = handleError(async (req, res, next) => {
  const topUsers = await userSchema.findAll({
    order: [["logInCount", "DESC"]],
    limit: 3,
  });

  if (!topUsers) return next(new AppError("no records", 404));
  res.json({ topUsers });
});

/*
endpoint to display the inactive users past 3 hours
*/

const inactiveUsers = handleError(async (req, res, next) => {
  const inactive = new Date();

  inactive.setHours(inactive.getHours - 4);

  const inactiveUsers = await userSchema.findAll({
    where: {
      updatedAt: {
        [Sequelize.Op.lt]: inactive,
      },
    },
  });

  if (!inactiveUsers) return next(new AppError("no records", 404));
  res.json({ inactiveUsers });
});

export default {
  register,
  signIn,
  verifyUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  topThree,
  inactiveUsers,
};
