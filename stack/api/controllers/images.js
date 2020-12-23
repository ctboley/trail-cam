/**
 * Controllers: Images
 */

const { images } = require("../models");

/**
 * Insert an image
 * @param {*} req
 * @param {*} res
 */
const insert = async (req, res) => {
  try {
    await images.insert(req.body);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).send({ message: "Successfully inserted image", image: req.body });
};

/**
 * Get a set of images
 * @param {*} req
 * @param {*} res
 */
const get = async (req, res) => {
  try {
    const imgs = await images.get();
    if (!imgs) {
      return res.status(404).send({ error: "No images found" });
    }
    res.status(200).send(imgs);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

/**
 * Get an image
 * @param {*} req
 * @param {*} res
 */
const getOne = async (req, res) => {
  try {
    const image = await images.getById(req.params.id);
    if (!image) {
      return res.status(404).send({ error: "Image not found" });
    }
    res.status(200).send({ ...image });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  get,
  getOne,
  insert,
};
