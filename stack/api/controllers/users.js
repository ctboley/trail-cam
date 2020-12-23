/**
 * Controllers: Users
 */

const jwt = require("jsonwebtoken");
const { users } = require("../models");
const { comparePassword, sendEmail } = require("../utils");

/**
 * Save
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const register = async (req, res, next) => {
  try {
    await users.register(req.body);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }

  let user;
  try {
    user = await users.getByEmail(req.body.email);
  } catch (error) {
    console.log(error);
    return next(error, null);
  }

  const token = jwt.sign(user, process.env.tokenSecret, {
    expiresIn: 604800, // 1 week
  });

  res.send({ message: "Authentication successful", token });
};

/**
 * Sign a user in
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const login = async (req, res, next) => {
  let user;
  try {
    user = await users.getByEmail(req.body.email);
  } catch (error) {
    return done(error, null);
  }

  if (!user) {
    return res.status(404).send({ error: "Authentication failed. User not found." });
  }

  const isCorrect = comparePassword(req.body.password, user.password);
  if (!isCorrect) {
    return res.status(401).send({ error: "Authentication failed. Wrong password." });
  }

  const token = jwt.sign(user, process.env.tokenSecret, {
    expiresIn: 604800, // 1 week
  });

  res.send({ message: "Authentication successful", token });
};

/**
 * Get a user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const get = async (req, res, next) => {
  const user = users.convertToPublicFormat(req.user);
  res.send({ user });
};

/**
 * Add a favorite
 * @param {*} req
 * @param {*} res
 */
const addFavorite = async (req, res) => {
  try {
    if (req.user.favorites.find((obj) => obj.imageId === req.body.id)) {
      res.status(400).send({ message: "Favorite already exits" });
    } else {
      await users.addFavorite(req.user, req.body);
      res.status(200).send({ message: "Successfully added favorite" });
    }
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

/**
 * Remove a favorite
 * @param {*} req
 * @param {*} res
 */
const removeFavorite = async (req, res) => {
  const { favoriteId } = req.params;
  try {
    const fav = req.user.favorites.find((favorite) => favorite.imageId === favoriteId);
    if (!fav) {
      return res.status(404).send({ message: "Not currently a favorite" });
    }
    await users.removeFavorite(req.user, favoriteId);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
  res.status(200).send({ message: "Favorites updated" });
};

/**
 * Create a token from hashed password
 * @param {*} user
 * @returns {string} token
 */
const usePasswordHashToMakeToken = (user) => {
  const secret = user.password + "-" + user.createdAt;
  const token = jwt.sign(user, secret, {
    expiresIn: 3600, // one hour
  });
  return token;
};

/**
 * Send a password reset email
 * @param {*} req
 * @param {*} res
 */
const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;
  let user;
  try {
    user = await users.getByEmail(email);
    if (!user) {
      return res.status(404).send({ message: "No user with that email" });
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }

  const token = usePasswordHashToMakeToken(user);
  const url = `https://${process.env.domain}/update-password/${user.id}/${token}`;

  const sender = process.env.email;
  const subject = "Trail Cam - Password Reset";
  const message = `<p>Here is your password reset link,</p><a href=${url}>${url}</a>`;
  try {
    await sendEmail(sender, email, subject, message);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
  res.status(200).send({ message: "Reset password email sent" });
};

/**
 * Change user password
 * @param {*} req
 * @param {*} res
 */
const receiveNewPassword = async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;

  try {
    const user = await users.getById(userId);
    if (!user) {
      return res.status(404).send({ message: "Invalid user" });
    }
    const secret = user.password + "-" + user.createdAt;
    const payload = jwt.decode(token, secret);
    if (payload.id === user.id) {
      await users.changePassword(user, password);
    }
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
  res.status(202).send({ message: "Password changed successfully" });
};

module.exports = {
  register,
  login,
  get,
  addFavorite,
  removeFavorite,
  sendPasswordResetEmail,
  receiveNewPassword,
};
