const express = require("express");
const bodyParser = require("body-parser");

const placesRouter = require("./routes/places-routes");
const usersRouter = require("./routes/users-routes");
const httpError = require("./models/http-error");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRouter);

app.use("/api/users", usersRouter);

app.use((req, res, next) => {
  const error = new httpError("Could not find this route!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error happened" });
});
mongoose
  .connect('mongodb+srv://Mido:QCsx!vr2-MdeJkX@cluster0.vejqa4q.mongodb.net/places_project?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5001);
    console.log("Connected to the database");
  })
  .catch((e) => {
    const error = "Could not connect to database";
    return next(error, 500);
  });
