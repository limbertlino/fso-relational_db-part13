require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const print_blogs = async () => {
  try {
    const blogs = await sequelize.query("SELECT * FROM blogs", {
      type: QueryTypes.SELECT,
    });
    console.log(blogs);
  } catch (error) {
    console.error(error);
  }
};

print_blogs();
