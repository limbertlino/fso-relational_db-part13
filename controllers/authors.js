const { Sequelize } = require("sequelize");
const { Blog, User } = require("../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll({
    order: [["likes", "DESC"]],
    attributes: [
      "author",
      [Sequelize.fn("COUNT", Sequelize.col("id")), "articles"],
      [Sequelize.fn("SUM", Sequelize.col("likes")), "likes"],
    ],
    group: "author",
  });
  res.status(200).json(blogs);
});

module.exports = router;
