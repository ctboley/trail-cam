/**
 * Controllers: Images
 */

const { images } = require("../models");

/**
 * Get a set of images
 * Queries
 * GET /images?createdAt
 * GET /images?limit
 * GET /images?skip
 * GET /images?sort
 * @param {*} req
 * @param {*} res
 *
 */
const get = async (req, res) => {
  const { createdAt, limit, skip, sort } = req.query;
  try {
    const imgs = await images.get(createdAt, limit, skip, sort);
    if (!imgs) {
      return res.status(404).send({ message: "No images found" });
    }
    res.status(200).send(imgs);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  get,
};
