const express = require("express");
const usersController = require("../controllers/users-controllers");
const { check } = require("express-validator");

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty().isLength({ min: 3 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signUp
);

router.post(
  "/login",
  [
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.login
);

module.exports = router;
