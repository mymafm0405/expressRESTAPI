const httpError = require("../models/http-error");
const { v4: uuid4 } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../models/user-model");

const getAllUsers = (req, res, next) => {
  if (DUMMY_USERS.length === 0) {
    const error = new httpError("No users found", 404);
    return next(error);
  }

  res.json({ users: DUMMY_USERS });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new httpError("Check your data!!", 422);
  }
  // if (DUMMY_USERS.find((u) => u.email === req.body.email)) {
  //   const error = new httpError("Email exists, use a different one!", 422);
  //   throw error;
  // }
  let userExist;

  try {
    userExist = await User.findOne({ email: req.body.email });
  } catch (error) {
    const e = new httpError("Something wrong!", 500);
    return next(e);
  }

  if (userExist) {
    const error = new httpError("Email exists, use a different one!", 422);
    return next(error);
  }

  // req.body.id = uuid4();
  // DUMMY_USERS.push(req.body);

  const createdUser = new User({ ...req.body, image: "some url will be here" });
  try {
    await createdUser.save();
  } catch (error) {
    const e = new httpError("Something wrong!", 500);
    return next(e);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new httpError("Check your data!!", 422);
  }
  const foundUser = DUMMY_USERS.find(
    (u) => u.email === req.body.email && u.password === req.body.password
  );

  if (!foundUser) {
    const error = new httpError("Check your email and password!", 401);
    throw error;
  }

  res.json({ user: foundUser });
};

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
