const httpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place-model");
const User = require("../models/user-model");
const { default: mongoose } = require("mongoose");

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

  let user;
  try {
    user = await User.findById(creator);
  } catch (e) {
    const error = new httpError("Something wrong happened!", 500);
    return next(error);
  }
  console.log(user);

  if (!user) {
    const error = new httpError("No users found with this id", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
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
    foundPlaces = await User.findById(userId).populate('places');
    console.log(foundPlaces)
  } catch (e) {
    const error = new httpError("Something wrong happened!!!", 500);
    return next(error);
  }

  if (!foundPlaces && foundPlaces.length === 0) {
    return next(new httpError("Could not find a user id!!", 404));
  }
  res.json({ places: foundPlaces.places.map((p) => p.toObject({ getters: true })) });
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
    foundPlace = await Place.findById(pid).populate("creator");
    console.log(foundPlace)
  } catch (error) {
    const e = new httpError("Something wrong happened!!!!", 500);
    return next(e);
  }
  if (!foundPlace) {
    const error = new httpError("No place to delete", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await foundPlace.remove({ session: sess });
    console.log(foundPlace.creator.places)
    foundPlace.creator.places.pull(foundPlace);
    console.log(foundPlace)
    console.log(foundPlace.creator.places)
    await foundPlace.creator.save({ session: sess });
    await sess.commitTransaction()
  } catch (error) {
    const e = new httpError("Something wrong happened???", 500);
    return next(e);
  }

  res.json("Deleted");
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
