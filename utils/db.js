const { Sequelize } = require("sequelize");
const { DATABASE_URL } = require("./config");

const sequelize = new Sequelize(DATABASE_URL);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to the db");
  } catch (error) {
    console.log("Failed to connect to the database");
    return process.exit();
  }

  return null;
};

module.exports = { sequelize, connectToDatabase };
