/**
 * Model: Images
 */

const AWS = require("aws-sdk");
const shortid = require("shortid");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});

/**
 * Insert a new image
 * @param {string} image.key bucket key
 * @param {string} image.bucket bucket image is in
 */
const insert = async (image = {}) => {
  if (!image.key) {
    throw new Error(`"key" is required`);
  }
  if (!image.bucket) {
    throw new Error(`"bucket" is required`);
  }

  const params = {
    TableName: process.env.imageDb,
    Item: {
      hk: shortid.generate(),
      createdAt: Date.now(),
      key: image.key,
      bucket: image.bucket,
    },
  };

  await dynamodb.put(params).promise();
};

/**
 * Get a set of images
 */
const get = async () => {
  const params = {
    TableName: process.env.imageDb,
  };

  let imgs = await dynamodb.scan(params).promise();

  if (!imgs.Items || imgs.Items.length <= 0) {
    imgs = null;
  } else if (imgs.Items.length > 0) {
    imgs = imgs.Items.map((img) => ({ ...convertToReadableFormat(img) }));
  }

  return imgs;
};

/**
 * Get an image by id
 * @param {string} id
 */
const getById = async (id) => {
  if (!id) {
    throw new Error(`"key" is required`);
  }

  const params = {
    TableName: process.env.imageDb,
    KeyConditionExpression: "hk = :hk",
    ExpressionAttributeValues: { ":hk": id },
  };

  let image = await dynamodb.query(params).promise();
  image = image.Items && image.Items[0] ? convertToReadableFormat(image.Items[0]) : null;

  return image;
};

/**
 * Convert image record to public format
 * @param {*} image
 */
const convertToReadableFormat = (image = {}) => {
  image.id = image.hk || null;
  image.createdAt = new Date(image.createdAt).toISOString() || null;
  if (image.hk) delete image.hk;
  return image;
};

module.exports = {
  get,
  getById,
  insert,
};
