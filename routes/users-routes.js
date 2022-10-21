const express = require("express");
const usersController = require("../controllers/users-controllers");

const router = express.Router();

router.get("/", usersController.getAllUsers);

router.post("/signup", usersController.signUp);

router.post("/login", usersController.login);

module.exports = router;
