const router = require("express").Router();
const jwt = require("jsonwebtoken");

const { Blog, User } = require("../models");
const { SECRET } = require("../utils/config");
const { Op } = require("sequelize");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization?.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "Token invalid" });
    }
  } else {
    return res.status(401).json({ error: "Token missing" });
  }
  next();
};

router.get("/", async (req, res, next) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    order: [["likes", "DESC"]],
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },

    where,
  });
  res.status(200).json(blogs);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);

  if (req.body.year < 1991 || req.body.year > new Date().getFullYear()) {
    return res
      .status(400)
      .json({ error: "The year must be between 1991 and the current year" });
  }

  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
  });
  console.log(JSON.stringify(blog, null, 2));
  res.json(blog);
});

router.delete("/:id", tokenExtractor, async (req, res, next) => {
  const { id } = req.params;
  const blogToDelete = await Blog.findByPk(id);

  if (!blogToDelete) {
    return res.status(404).json({ error: "Blog not found" });
  }

  if (req.decodedToken.id === blogToDelete.userId) {
    console.log("coincide");
    await Blog.destroy({
      where: {
        id: id,
      },
    });

    return res.status(204).send();
  } else {
    return res
      .status(401)
      .json({ error: "User is not authorized to delete this blog" });
  }
});

router.put("/:id", async (req, res, next) => {
  const [updatedRowsCount, updatedBlogs] = await Blog.update(
    { likes: req.body.likes },
    {
      where: {
        id: req.params.id,
      },
      returning: true,
    }
  );

  if (updatedRowsCount > 0) {
    return res.status(200).json({ likes: updatedBlogs[0].likes });
  } else {
    return res.status(404).json({ message: "Blog not found" });
  }
});

module.exports = router;
