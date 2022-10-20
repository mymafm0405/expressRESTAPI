const express = require("express");
const router = express.Router();

const httpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state",
    description: "One of the most popular sky scrappers in the world",
    location: {
      lat: 222,
      lng: 444,
    },
    address: "Somewhere in the world :-D",
    creater: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const foundPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!foundPlace) {
    throw new httpError("Could not find a place with this id!!!!", 404);
  }
  res.json({ foundPlace });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const foundPlace = DUMMY_PLACES.find((place) => place.creater === userId);

  if (!foundPlace) {
    return next(new httpError("Could not find a user id!!", 404));
  }
  res.json({ foundPlace });
});

module.exports = router;
