const express = require("express");
require("express-async-errors");
const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");
const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");

const errorHandler = (error, req, res, next) => {
  console.log(JSON.stringify(error.errors[0], null, 2));
  if (error.errors[0].validatorKey === "isEmail") {
    return res.status(400).json({ error: error.message });
  } else if (error) {
    return res
      .status(400)
      .json({ error: error.name, errorMessage: error.message });
  }

  next();
};

app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
