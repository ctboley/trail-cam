/**
 * Utils
 */

const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
const { defaultConfiguration } = require("../app");

const ses = new AWS.SES({ region: process.env.AWS_REGION });

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

/**
 * Validate email address
 */
const validateEmailAddress = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Hash password
 * @param {*} user
 */
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

/**
 * Compare password
 */
const comparePassword = (candidatePassword, trustedPassword) => {
  return bcrypt.compareSync(candidatePassword, trustedPassword);
};

/**
 * Send a email with AWS SES
 * @param {string} sender
 * @param {string} recipient
 * @param {string} subject
 * @param {string} message
 */
const sendEmail = async (sender, recipient, subject, message) => {
  const params = {
    Source: sender,
    Destination: { ToAddresses: [recipient] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: message,
        },
        // Text: {
        //   Charset: "UTF-8",
        //   Data: message,
        // },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    ReturnPath: sender,
  };

  await ses.sendEmail(params).promise();
};

/**
 * Gets a signed s3 url
 * @param {string} bucket
 * @param {key} key
 * @param {number} expires default is 1 hour
 *
 * @returns {string} signed url
 */
const generateSignedUrl = (bucket, key, expires = 3600) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Expires: expires,
  };
  return s3.getSignedUrl("getObject", params);
};

const sendVerificationEmail = async (email = "") => {
  if (email) {
    const params = {
      EmailAddress: email,
    };
    await ses.verifyEmailIdentity(params).promise();
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  validateEmailAddress,
  sendEmail,
  generateSignedUrl,
  sendVerificationEmail,
};
