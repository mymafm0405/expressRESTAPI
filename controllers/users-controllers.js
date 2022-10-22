const httpError = require("../models/http-error");
const { v4: uuid4 } = require("uuid");
const { validationResult } = require('express-validator')

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Mahmoud",
    email: "email@email.com",
    password: "password",
  },
  {
    id: "u2",
    name: "Mido",
    email: "email2@email2.com",
    password: "password2",
  },
];

const getAllUsers = (req, res, next) => {
  if (DUMMY_USERS.length === 0) {
    const error = new httpError("No users found", 404);
    return next(error);
  }

  res.json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new httpError('Check your data!!', 422)
  }
  if (DUMMY_USERS.find((u) => u.email === req.body.email)) {
    const error = new httpError("Email exists, use a different one!", 422);
    throw error;
  }
  req.body.id = uuid4();
  DUMMY_USERS.push(req.body);

  res.status(201).json({ user: req.body });
};

const login = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new httpError('Check your data!!', 422)
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
