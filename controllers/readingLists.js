const { ReadingList } = require("../models");

const router = require("express").Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  const blogUser = await ReadingList.create({
    userId: req.body.userId,
    blogId: req.body.blogId,
    isRead: req.body.isRead
  });

  res.json(blogUser);
  // res.end();
});

module.exports = router;
