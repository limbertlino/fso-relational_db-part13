const router = require("express").Router();

const { Blog } = require("../models");

router.get("/", async (req, res, next) => {
  const notes = await Blog.findAll();
  console.log(JSON.stringify(notes, null, 2));
  res.status(200).json(notes);
});

router.post("/", async (req, res, next) => {
  const blog = await Blog.create(req.body);
  console.log(JSON.stringify(blog, null, 2));
  res.json(blog);
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  const deletedCount = await Blog.destroy({
    where: {
      id: id,
    },
  });

  if (deletedCount === 0)
    return res.status(404).json({ message: "Blog not found" });

  return res.status(204).send();
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
