const AWS = require("aws-sdk");
const { simpleParser } = require("mailparser");
const shortid = require("shortid");
const moment = require("moment");
const s3client = new AWS.S3({ region: "us-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
});

module.exports.handler = async (event, context) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;
    const eventTime = record.eventTime;

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

    // upload to s3
    const promises = attachments.map((attachment) => {
      const params = {
        Bucket: bucket,
        Key: `images/${attachment.filename}`,
        Body: attachment.content,
      };
      return s3client.putObject(params).promise();
    });

    await Promise.all(promises);

    // map attachments for dynamodb
    const data = attachments.map((attachment) => ({
      id: shortid.generate(),
      key: `images/${attachment.filename}`,
      createdAt: new Date().toISOString(),
    }));

    // check if a dynamodb entry has been make for this hour
    const adjustedDate = moment(eventTime).subtract(1, "hours").toISOString();
    let params = {
      TableName: process.env.imageDb,
      KeyConditionExpression: "hk = :hk and sk > :sk",
      ExpressionAttributeValues: { ":hk": bucket, ":sk": adjustedDate },
      ScanIndexForward: false,
    };
    const response = await dynamodb.query(params).promise();

    if (response.Items.length <= 0) {
      // create new entry
      const date = moment(eventTime).startOf("hour").toISOString();
      params = {
        TableName: process.env.imageDb,
        Item: {
          hk: bucket,
          sk: date,
          data: data,
        },
      };
      await dynamodb.put(params).promise();
    } else {
      // use existing entry
      params = {
        TableName: process.env.imageDb,
        Key: { hk: response.Items[0].hk, sk: response.Items[0].sk },
        UpdateExpression: "set #data = :data",
        ExpressionAttributeNames: { "#data": "data" },
        ExpressionAttributeValues: { ":data": response.Items[0].data.concat(data) },
      };
      await dynamodb.update(params).promise();
    }
  }
  return "successful invocation";
};
