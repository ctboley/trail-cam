export const s3Event = {
  Records: [
    {
      eventVersion: "2.1",
      eventSource: "aws:s3",
      awsRegion: "us-east-1",
      eventTime: "2020-12-19T00:49:16.150Z",
      eventName: "ObjectCreated:Put",
      userIdentity: {
        principalId: "A1QJYUQST5LNJW",
      },
      requestParameters: {
        sourceIPAddress: "68.102.119.180",
      },
      responseElements: {
        "x-amz-request-id": "020757565FCACE54",
        "x-amz-id-2":
          "axnHGp2ucWvIKzNIp37hMOx69rJVZeu42Qp7Mkt7L6jiuOtEcQnsf5OVsC+akX7Ec94g5ba2Q1l2TgB1VvYRGZsqm9nSj0LK",
      },
      s3: {
        s3SchemaVersion: "1.0",
        configurationId: "1e4fca0d-2f4f-4873-a7be-dc8b88d3fc5b",
        bucket: {
          name: "trail-cam-integration-dev-inbox-bucket",
          ownerIdentity: {
            principalId: "A1QJYUQST5LNJW",
          },
          arn: "arn:aws:s3:::trail-cam-integration-dev-inbox-bucket",
        },
        object: {
          key: "inbox/test.txt",
          size: 5,
          eTag: "d8e8fca2dc0f896fd7cb4cb0031ba249",
          sequencer: "005FDD4F79AEEEFBD2",
        },
      },
    },
  ],
};
