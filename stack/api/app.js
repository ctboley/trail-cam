const express = require("express");
const app = express();
const passport = require("passport");
const { users, images } = require("./controllers");

/**
 * Configure Passport
 */

try {
  require("./config/passport")(passport);
} catch (error) {
  console.log(error);
}

/**
 * Configure Express.js Middleware
 */

// Enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("x-powered-by", "serverless-express");
  next();
});

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Enable JSON use
app.use(express.json());

// Since Express doesn't support error handling of promises out of the box,
// this handler enables that
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Routes - Public
 */

app.options(`*`, (req, res) => {
  res.status(200).send();
});

app.post(`/users/register`, asyncHandler(users.register));

app.post(`/users/login`, asyncHandler(users.login));

app.post(`/reset-password/user`, asyncHandler(users.sendPasswordResetEmail));

app.post(`/new-password/:userId/:token`, asyncHandler(users.receiveNewPassword));

app.get(`/test/`, (req, res) => {
  res.status(200).send("Request received");
});

// app.post(`/images`, asyncHandler(images.insert));

app.get(`/images`, asyncHandler(images.get));

app.get(`/images/:id`, asyncHandler(images.getOne));

/**
 * Routes - Protected
 */

app.post(`/user`, passport.authenticate("jwt", { session: false }), asyncHandler(users.get));

app.post(`/user/favorite`, passport.authenticate("jwt", { session: false }), asyncHandler(users.addFavorite));

/**
 * Routes - Catch-All
 */

app.get(`/*`, (req, res) => {
  res.status(404).send("Route not found");
});

/**
 * Error Handler
 */
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: `Internal Serverless Error - "${err.message}"` });
});

module.exports = app;
