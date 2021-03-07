/**
 * Model: Images
 */

const AWS = require('aws-sdk');
const moment = require('moment');
const utils = require('../utils');

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});

/**
 * Get a set of images
 * @param {string} startDate dates are in UTC
 * @param {string} endDate
 * @param {number} limit
 * @param {number} skip
 * @param {string} sort
 */
const get = async (startDate, endDate, limit = 10, skip = 0, sort = 'desc') => {
  if (!startDate) {
    startDate = moment().subtract(1, 'hour').toISOString();
  } else {
    startDate = moment(startDate).toISOString();
  }
  if (endDate) {
    endDate = moment(endDate).toISOString();
  }
  const params = {
    TableName: process.env.imageDb,
    KeyConditionExpression: !endDate
      ? 'hk = :hk and sk > :startDate'
      : 'hk = :hk and sk between :startDate and :endDate',
    ExpressionAttributeValues: !endDate
      ? { ':hk': process.env.bucket, ':startDate': startDate }
      : { ':hk': process.env.bucket, ':startDate': startDate, ':endDate': endDate },
    // Limit: limit ? limit : undefined,
    ScanIndexForward: sort === 'desc' ? false : true,
  };

  let response = await dynamodb.query(params).promise();

  let imgs = response.Items;

  while (response.LastEvaluatedKey) {
    const key = response.LastEvaluatedKey;
    response = await dynamodb.query({ ExclusiveStartKey: key, ...params }).promise();
    imgs = imgs.concat(response.Items);
  }

  if (imgs) {
    const convertedImages = [];
    for (const img of imgs) {
      for (const obj of img.data) {
        const convertedImg = convertToReadableFormat(img.hk, obj);
        convertedImages.push(convertedImg);
      }
    }
    if (limit) {
      imgs = convertedImages.slice(skip, limit);
    } else {
      imgs = convertedImages;
    }
  }

  return imgs;
};

/**
 * Convert image record to public format
 * @param {string} bucket
 * @param {*} data
 */
const convertToReadableFormat = (bucket, data = {}) => {
  return {
    id: data.id,
    createdAt: data.createdAt,
    bucket,
    key: data.key,
    url: utils.generateSignedUrl(bucket, data.key),
  };
};

module.exports = {
  get,
};
