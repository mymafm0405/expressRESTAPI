const express = require("express");
const router = express.Router();

const placesControllers = require("../controllers/places-controller");

router.post('/', placesControllers.createPlace)

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);


module.exports = router;
