/**
 * Utils: Back-end
 */

import config from '../config';
import axios from 'axios';
import Image from '../models/image';
// import moment from 'moment';

const instance = axios.create({
  baseURL: config.domains.api,
  responseType: 'json',
});

const headers = {
  'Content-Type': 'application/json',
};

/**
 * Formats token a Bearer token Authorization header
 * @param {string} token
 * @returns {string}
 */
const formatAuth = (token) => ({ Authorization: `Bearer: ${token}` });

/**
 * Register a new user
 * @param {string} email
 * @param {string} password
 * @returns {AxiosResponse}
 */
export const userRegister = async (email, password) => {
  const response = await instance.post('/user/register', { email, password }, { headers });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Login a new user
 * @param {string} email
 * @param {string} password
 * @returns {AxiosResponse}
 */
export const userLogin = async (email, password) => {
  const response = await instance.post('/users/login', { email, password }, { headers });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Gets a user
 * @param {string} token
 * @returns {AxiosResponse}
 */
export const userGet = async (token) => {
  const response = await instance.post('/user', null, {
    headers: { ...formatAuth(token), ...headers },
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Adds an image to a user's favorites
 * @param {Image} image
 * @returns {AxiosResponse}
 */
export const addFavorite = async (token, image) => {
  if (!(image instanceof Image)) {
    throw new Error('image must be an instance of Image');
  }
  const response = await instance.post('/user/favorite', image, { headers: { ...formatAuth(token), ...headers } });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Sends a reset password email
 * @param {string} email
 * @returns {AxiosResponse}
 */
export const resetPassword = async (email) => {
  const response = await instance.post('/reset_password/user', { email }, { headers });
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
 * @returns {AxiosResponse}
 */
export const changePassword = async (password, token, userId) => {
  const response = await instance.post('new_password/user', { password, token, userId }, { headers });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Removes a user favorite
 * @param {string} imageId
 * @param {string} token
 * @returns {AxiosResponse}
 */
export const removeFavorite = async (imageId, token) => {
  const response = await instance.patch(`/user/favorite/${imageId}`, null, {
    headers: { ...formatAuth(token), ...headers },
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
 * @returns {AxiosResponse}
 */
export const verifyEmail = async (email, token) => {
  const response = await instance.post(
    '/user/verify_email',
    { email },
    { headers: { ...formatAuth(token), ...headers } }
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};

/**
 * Get a set of images
 * @param {string} createdAt
 * @param {number} limit
 * @param {number} skip
 * @param {string} sort
 * @returns {AxiosResponse}
 */
export const getImages = async (createdAt, limit, skip, sort) => {
  const response = await instance.get('/images', {
    headers: {
      ...headers,
    },
    params: {
      createdAt,
      limit,
      skip,
      sort,
    },
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.error);
  }
  return response;
};
