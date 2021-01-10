/**
 * Utils: Back-end
 */

import config from "../config";
import axios from "axios";
import Image from "../models/image";

const instance = axios.create({
  baseURL: config.domains.api,
  responseType: "json"
});

const headers = {
  "Content-Type": "application/json"
};

const formatAuth = (token) => ({ Authorization: `Bearer: ${token}` });

/**
 * Register a new user
 */
export const userRegister = async (email, password) => {
  const response = await instance.post("/user/register", { email, password }, { headers });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return await response;
};

/**
 * Login a new user
 */
export const userLogin = async (email, password) => {
  const response = await instance.post("/users/login", { email, password }, { headers });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * userGet
 */
export const userGet = async (token) => {
  const response = await instance.post("/user", null, {
    headers: { ...formatAuth(token), ...headers }
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Adds an image to a user's favorites
 * @param {Image} image
 */
export const addFavorite = async (image) => {
  if (!(image instanceof Image)) {
    throw new Error("image must be an instance of Image");
  }
  const response = await instance.post("/user/favorite", image, { headers: { ...formatAuth(token), ...headers } });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Sends a reset password email
 * @param {string} email
 */
export const resetPassword = async (email) => {
  const response = await instance.post("/reset_password/user", { email }, { headers });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Changes a user password
 * @param {string} password
 * @param {string} token
 * @param {string} userId
 */
export const changePassword = async (password, token, userId) => {
  const response = await instance.post("new_password/user", { password, token, userId }, { headers });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Removes a user favorite
 * @param {string} imageId
 * @param {string} token
 */
export const removeFavorite = async (imageId, token) => {
  const response = await instance.patch(`/user/favorite/${imageId}`, null, {
    headers: { ...formatAuth(token), ...headers }
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Sends a verification email
 * @param {string} email
 * @param {string} token
 */
export const verifyEmail = async (email, token) => {
  const response = await instance.post(
    "/user/verify_email",
    { email },
    { headers: { ...formatAuth(token), ...headers } }
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};
