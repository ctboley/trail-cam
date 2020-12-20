const fs = require("fs");
const path = require("path");
const handler = require("../src/handler");

const s3Event = JSON.parse(fs.readFileSync(path.join(__dirname, "s3-event.json")));

describe("Email handler", () => {
  it("Should throw error for not providing key", async () => {
    let event = s3Event;
    delete event.Records[0].s3.object.key;
    await expect(() => handler(event)).rejects.toThrowError("Key is required");
  });

  it("Should throw error for not providing bucket", async () => {
    let event = s3Event;
    delete event.Records[0].s3.bucket.name;
    await expect(() => handler(event)).rejects.toThrowError("Bucket is required");
  });
});
