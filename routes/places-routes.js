const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");

router.post(
  "/",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.createPlace
);

router.patch(
  "/update/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.updatePlace
);

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.delete("/delete/:pid", placesControllers.deletePlace);

module.exports = router;
