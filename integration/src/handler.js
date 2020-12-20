const AWS = require("aws-sdk");
const { simpleParser } = require("mailparser");
const s3client = new AWS.S3({ region: "us-east-1" });

const handler = async (event, context) => {
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

    const promises = attachments.map((attachment) => {
      const params = {
        Bucket: bucket,
        Key: `images/${attachment.filename}`,
        Body: attachment.content,
      };
      return s3client.putObject(params).promise();
    });

    await Promise.all(promises);
  }
  return "successful invocation";
};

module.exports = handler;
