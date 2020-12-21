const AWS = require("aws-sdk");
const { simpleParser } = require("mailparser");
const shortid = require("shortid");
const s3client = new AWS.S3({ region: "us-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
});

module.exports.handler = async (event, context) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    if (!bucket) {
      throw new Error("Bucket is required");
    }
    if (!key) {
      throw new Error("Key is required");
    }

    const email = s3client.getObject({
      Bucket: bucket,
      Key: key,
    });

    const stream = email.createReadStream();
    const parsed = await simpleParser(stream);
    const attachments = parsed.attachments;

    let promises = attachments.map((attachment) => {
      const params = {
        Bucket: bucket,
        Key: `images/${attachment.filename}`,
        Body: attachment.content,
      };
      return s3client.putObject(params).promise();
    });

    await Promise.all(promises);

    promises = attachments.map((attachment) => {
      const params = {
        TableName: process.env.imageDb,
        Item: {
          hk: shortid.generate(),
          createdAt: Date.now(),
          key: `images/${attachment.filename}`,
          bucket: bucket,
        },
      };

      return dynamodb.put(params).promise();
    });

    await Promise.all(promises);
  }
  return "successful invocation";
};
