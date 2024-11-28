import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchema from "../../../database/model/user.model.js";
import { handleError } from "../../middleware/handleError.js";
import { AppError } from "../../util/AppError.js";

const signIn = handleError(async (req, res, next) => {
  let { email, password } = req.body;

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
          loginCount: Sequelize.literal("logInCount + 1"),
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

const register = handleError(async (req, res, next) => {
  let { name, email, password, role } = req.body;

  let isExist = await userSchema.findOne({ where: { email } });

  if (isExist) return next(new AppError("this user is already exist", 409));

  password = bcrypt.hashSync(password, 5);
  await userSchema.create({ name, email, password, role });

  res.json({ message: "user created successfully" });
});

const verifyUser = handleError(async (req, res, next) => {
  let { email } = req.body;

  let isExist = await userSchema.findOne({ where: { email } });

  if (isExist.verified == true)
    return next(new AppError("this user is already verified", 409));

  await userSchema.update({ verified: true }, { where: { email } });

  res.json({ message: "user created successfully" });
});

const getUser = handleError(async (req, res, next) => {
  const id = req.params.id;

  let isExist = await userSchema.findOne({ where: { id } });

  if (!isExist) return next(new AppError("no records", 404));

  res.status(200).json({ user: isExist });
});

const updateuser = handleError(async (req, res, next) => {
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

const getAllusers = handleError(async (req, res, next) => {
  const search = req.query.search;
  if (search) {
    let users = await userSchema.findAll({
      where: {
        [Op.or]: {
          id: search,
          name: search,
          email: search,
          verified: search,
        },
      },
    });
    res.json(users);
  } else {
    const totalUsers = await userSchema.count();
    const verifiedUsers = await userSchema.count({ where: { verified: true } });

    res.json({ totalUsers, verifiedUsers });
  }
});
const topThree = handleError(async (req, res, next) => {
  const topUsers = await userSchema.findAll({
    attributes: ["id", "name", "email", "logInCount"],
    order: [["logInCount", "DESC"]],
    limit: 3,
  });

  if (!topUsers) return next(new AppError("no records", 404));
  res.json({ topUsers });
});

export default {
  register,
  signIn,
  verifyUser,
  getUser,
  updateuser,
  deleteUser,
  getAllusers,
  topThree
};
