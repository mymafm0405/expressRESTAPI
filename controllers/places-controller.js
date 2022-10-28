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
    const error = new httpError("Could not create the place", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let foundPlace;
  try {
    foundPlace = await Place.findById(placeId);
  } catch (e) {
    const error = new httpError(
      "Something wrong happened when trying to find that place!",
      404
    );
    return next(error);
  }

  if (!foundPlace) {
    throw new httpError("Could not find a place with this id!!!!", 404);
  }
  res.json({ foundPlace: foundPlace.toObject({ getters: true }) });
};

const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let foundPlaces;
  try {
    foundPlaces = await Place.find({ creator: userId });
  } catch (e) {
    const error = new httpError("Something wrong happened!!!", 500);
    return next(error);
  }

  if (foundPlaces.length === 0) {
    return next(new httpError("Could not find a user id!!", 404));
  }
  res.json({ places: foundPlaces.map((p) => p.toObject({ getters: true })) });
};

const updatePlace = async (req, res, next) => {
  const pid = req.params.pid;
  let foundPlace;

  try {
    foundPlace = await Place.findById(pid);
  } catch (e) {
    const error = new httpError("Error happened", 500);
    return next(error);
  }

  if (!foundPlace) {
    const error = new httpError("No place with this id", 404);
    return next(error);
  }

  for (const key in req.body) {
    if (foundPlace[key]) {
      foundPlace[key] = req.body[key];
    }
  }
  try {
    await foundPlace.save();
  } catch (error) {
    const e = new httpError("Could not update the place!", 500);
    return next(e);
  }
  res.json({ foundPlace: foundPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const pid = req.params.pid;
  let foundPlace;

  try {
    foundPlace = await Place.findById(pid);
  } catch (error) {
    const e = new httpError("Something wrong happened", 500);
    return next(e);
  }
  if (!foundPlace) {
    const error = new httpError("No place to delete", 404);
    return next(error);
  }

  try {
    await foundPlace.remove()
  } catch (error) {
    const e = new httpError("Something wrong happened", 500);
    return next(e)
  }

  res.json("Deleted");
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
