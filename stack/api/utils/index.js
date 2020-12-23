/**
 * Utils
 */

const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
const { defaultConfiguration } = require("../app");

const ses = new AWS.SES();

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

module.exports = {
  hashPassword,
  comparePassword,
  validateEmailAddress,
  sendEmail,
};
