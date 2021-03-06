/**
 * Model: Users
 */

const AWS = require("aws-sdk");
const shortid = require("shortid");
const utils = require("../utils");
const moment = require("moment");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});

/**
 * Register user
 * @param {string} user.email User email
 * @param {string} user.password User password
 */
const register = async (user = {}) => {
  // Validate
  if (!user.email) {
    throw new Error(`"email" is required`);
  }
  if (!user.password) {
    throw new Error(`"password" is required`);
  }
  if (!utils.validateEmailAddress(user.email)) {
    throw new Error(`"${user.email}" is not a valid email address`);
  }

  // Check if user is already registered
  const existingUser = await getByEmail(user.email);
  if (existingUser) {
    throw new Error(`A user with email "${user.email}" is already registered`);
  }

  user.password = utils.hashPassword(user.password);

  // Save
  const params = {
    TableName: process.env.userDb,
    Item: {
      hk: user.email,
      sk: "user",
      sk2: shortid.generate(),
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
      password: user.password,
      favorites: [],
    },
  };

  await dynamodb.put(params).promise();
};

/**
 * Get user by email address
 * @param {string} email
 */
const getByEmail = async (email) => {
  // Validate
  if (!email) {
    throw new Error(`"email" is required`);
  }
  if (!utils.validateEmailAddress(email)) {
    throw new Error(`"${email}" is not a valid email address`);
  }

  // Query
  const params = {
    TableName: process.env.userDb,
    KeyConditionExpression: "hk = :hk",
    ExpressionAttributeValues: { ":hk": email },
  };

  let user = await dynamodb.query(params).promise();

  user = user.Items && user.Items[0] ? user.Items[0] : null;
  if (user) {
    user.id = user.sk2;
    user.email = user.hk;
  }
  return user;
};

/**
 * Get user by id
 * @param {string} id
 */
const getById = async (id) => {
  // Validate
  if (!id) {
    throw new Error(`"id" is required`);
  }

  // Query
  const params = {
    TableName: process.env.userDb,
    IndexName: process.env.userDbIndex1,
    KeyConditionExpression: "sk2 = :sk2 and sk = :sk",
    ExpressionAttributeValues: { ":sk2": id, ":sk": "user" },
  };
  let user = await dynamodb.query(params).promise();

  user = user.Items && user.Items[0] ? user.Items[0] : null;
  if (user) {
    user.id = user.sk2;
    user.email = user.hk;
  }
  return user;
};

/**
 * Convert user record to public format
 * This hides the keys used for the dynamodb's single table design and returns human-readable properties.
 * @param {*} user
 */
const convertToPublicFormat = (user = {}) => {
  user.email = user.hk || null;
  user.id = user.sk2 || null;
  if (user.hk) delete user.hk;
  if (user.sk) delete user.sk;
  if (user.sk2) delete user.sk2;
  if (user.password) delete user.password;
  return user;
};

/**
 * Insert a favorite
 * @param {*} user
 * @param {*} image
 */
const addFavorite = async (user = {}, image = {}) => {
  if (!user.email) {
    throw new Error(`"email" is required`);
  }
  if (!user.favorites) {
    throw new Error(`"favorites" is required`);
  }
  if (!image.id) {
    throw new Error(`"Image id" is required`);
  }
  if (image.url) {
    delete image.url;
  }

  const params = {
    TableName: process.env.userDb,
    Key: { hk: user.email, sk: "user" },
    UpdateExpression: "set #favorites = :favorites",
    ExpressionAttributeNames: { "#favorites": "favorites" },
    ExpressionAttributeValues: { ":favorites": user.favorites.concat({ ...image }) },
  };

  await dynamodb.update(params).promise();
};

/**
 * Remove a favorite
 * @param {*} user
 * @param {*} id
 */
const removeFavorite = async (user = {}, id) => {
  if (!user.email) {
    throw new Error(`"email" is required`);
  }
  if (!id) {
    throw new Error(`"id" is required`);
  }

  const params = {
    TableName: process.env.userDb,
    Key: { hk: user.email, sk: "user" },
    UpdateExpression: "set #favorites = :favorites",
    ExpressionAttributeNames: { "#favorites": "favorites" },
    ExpressionAttributeValues: { ":favorites": user.favorites.filter((favorite) => favorite.id !== id) },
  };

  await dynamodb.update(params).promise();
};

/**
 * Change user password
 * @param {*} user
 * @param {string} password
 */
const changePassword = async (user = {}, password) => {
  if (!user.email) {
    throw new Error(`"email" is required`);
  }
  if (!password) {
    throw new Error(`"password" is required`);
  }

  const encryptedPassword = utils.hashPassword(password);

  const params = {
    TableName: process.env.userDb,
    Key: { hk: user.email, sk: "user" },
    UpdateExpression: "set #password = :password",
    ExpressionAttributeNames: { "#password": "password" },
    ExpressionAttributeValues: { ":password": encryptedPassword },
  };

  await dynamodb.update(params).promise();
};

module.exports = {
  register,
  getByEmail,
  getById,
  convertToPublicFormat,
  addFavorite,
  removeFavorite,
  changePassword,
};
