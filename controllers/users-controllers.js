const httpError = require("../models/http-error");
const { v4: uuid4 } = require("uuid");
const { validationResult } = require("express-validator");

const User = require("../models/user-model");

const getAllUsers = async (req, res, next) => {
  let foundUsers;

  try {
    foundUsers = await User.find({}, "-password");
  } catch (e) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  if (foundUsers.length === 0) {
    const error = new httpError("No users found", 404);
    return next(error);
  }

  res.json({ users: foundUsers.map((u) => u.toObject({ getters: true })) });
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

  const createdUser = new User({ ...req.body, places: [], image: "some url will be here" });
  try {
    await createdUser.save();
  } catch (error) {
    const e = new httpError("Something wrong!", 500);
    return next(e);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new httpError("Check your data!!", 422);
  }

  let foundUser;

  try {
    foundUser = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
  } catch (e) {
    const error = new httpError("Something went wrong", 500);
    return next(error);
  }

  if (!foundUser) {
    const error = new httpError("Check your email and password!", 401);
    return next(error);
  }

  res.json({ user: foundUser });
};

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;
