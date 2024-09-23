const router = require("express").Router();

const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  try {
    const notes = await Blog.findAll();
    console.log(JSON.stringify(notes, null, 2));
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(JSON.stringify(blog, null, 2));
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCount = await Blog.destroy({
      where: {
        id: id,
      },
    });

    if (deletedCount === 0)
      return res.status(404).json({ message: "Blog not found" });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  try {
    if (req.blog) {
      req.blog.likes = req.body.likes;
      await req.blog.save();
      return res.status(204).send();
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error });
  }
});

module.exports = router;
