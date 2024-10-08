const { User, Blog } = require("../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["createdAt", "updatedAt", "id"] },
    include: [
      {
        model: Blog,
        as: "reading_list_blogs",
        attributes: { exclude: ["userId"] },
        through: {
          attributes: [],
        },
      },
    ],
  });
  res.json(user);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.put("/:username", async (req, res) => {
  const [updatedRowCount, updatedUser] = await User.update(
    { username: req.body.username },
    {
      where: {
        username: req.params.username,
      },
      returning: true,
    }
  );

  if (updatedRowCount > 0) {
    return res.status(200).json({ username: updatedUser[0].username });
  } else {
    return res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
