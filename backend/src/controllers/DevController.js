const axios = require("axios");
const Dev = require("../models/Dev");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (dev) {
      return res.json({ error: "User already created in database" });
    }
    const response = await axios.get(
      `https://api.github.com/users/${github_username}`
    );

    const { name = login, avatar_url, bio } = response.data;

    const techsArray = techs.split(",").map(tech => tech.trim());

    const location = {
      type: "Point",
      coordinates: [latitude, longitude]
    };

    dev = await Dev.create({
      github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    });

    console.log(response);
    return res.json(dev);
  },

  async update(req, res) {
    const { techs, bio, avatar_url, name, latitude, longitude } = req.body;
    const { github_username } = req.query;
    const location = {
      type: "Point",
      coordinates: [latitude, longitude]
    };

    let dev = await Dev.findOne({ github_username });
    if (!dev) {
      return res.json({ error: "User not found" });
    }
    dev = await Dev.updateOne(
      { github_username },
      { techs, name, bio, avatar_url, location }
    );

    return res.json({ dev });
  },

  async destroy(req, res) {
    const { github_username } = req.query;
    const dev = await Dev.deleteOne({ github_username });
    if (dev) {
      console.log("user was deleted with success");
    }
    return res.json(dev);
  }
};
