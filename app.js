const express = require("express");
const bodyParser = require("body-parser");

const placesRouter = require('./routes/places-routes')
const usersRouter = require('./routes/users-routes')
const httpError = require('./models/http-error')

const app = express();

app.use(bodyParser.json())

app.use('/api/places', placesRouter)

app.use('/api/users', usersRouter)


app.use((req, res, next) => {
    const error = new httpError('Could not find this route!', 404)
    throw error;
})

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error happened'})
})

app.listen(5001);
