const express = require("express");
require("express-async-errors");
const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const readingListsRouter = require("./controllers/readingLists");

const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error === null) return null;
  if (error.errors[0].validatorKey === "isEmail") {
    return res.status(400).json({ error: error.message });
  } else if (error) {
    return res
      .status(400)
      .json({ error: error.name, errorMessage: error.message });
  }
  next(error);
};

app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readingListsRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
