const express = require("express");
const router = express.Router();

const placesControllers = require("../controllers/places-controller");

router.post('/', placesControllers.createPlace)

router.patch('/update/:pid', placesControllers.updatePlace)

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlaceByUserId);

router.delete('/delete/:pid', placesControllers.deletePlace)


module.exports = router;
