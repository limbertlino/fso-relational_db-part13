require("dotenv").config();
const express = require("express");
const { Sequelize } = require("sequelize");

const app = express();
const sequelize = new Sequelize(process.env.DATABASE_URL);

app.use(express.json());

const testing_connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testing_connection();

// app.listen(process.env.PORT || 3002, () => {
//   console.log("Started");
// });
