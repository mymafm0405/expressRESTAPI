const httpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place-model");

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new httpError("Invalid inputs, check your data!!!", 422);
  }
  const { title, description, coordinates, address, creator } = req.body;
  console.log(req.body);

  // const createdPlace = {
  //   id: uuidv4(),
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator,
  // };

  const createdPlace = new Place({
    title,
    description,
    address,
    image: "some url",
    creator,
    location: coordinates,
  });

  try {
    await createdPlace.save();
  } catch (e) {
    const error = "Could not create the place";
    return next(error, 500);
  }

  res.status(201).json({ place: createdPlace });
};

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const foundPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!foundPlace) {
    throw new httpError("Could not find a place with this id!!!!", 404);
  }
  res.json({ foundPlace });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const foundPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  if (foundPlaces.length === 0) {
    return next(new httpError("Could not find a user id!!", 404));
  }
  res.json({ places: foundPlaces });
};

const updatePlace = (req, res, next) => {
  const pid = req.params.pid;
  const foundPlace = DUMMY_PLACES.find((p) => p.id === pid);

  if (!foundPlace) {
    const error = new httpError("No place with this id", 404);
    return next(error);
  }

  for (const key in req.body) {
    if (foundPlace[key]) {
      foundPlace[key] = req.body[key];
    }
  }
  res.json(foundPlace);
};

const deletePlace = (req, res, next) => {
  const pid = req.params.pid;
  const foundPlace = DUMMY_PLACES.find((p) => p.id === pid);
  if (!foundPlace) {
    const error = new httpError("No place to delete", 404);
    return next(error);
  }

  const idx = DUMMY_PLACES.findIndex((p) => p.id === pid);
  DUMMY_PLACES.splice(idx, 1);

  res.json("Deleted");
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
