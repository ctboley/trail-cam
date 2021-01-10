class Image {
  constructor(image) {
    this.id = image.id;
    this.createdAt = image.createdAt;
    this.bucket = image.bucket;
    this.key = image.key;
    this.url = image.url;
  }
}

export default Image;
