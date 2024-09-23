require("dotenv").config();
const express = require("express");
const { Sequelize, Model, DataTypes } = require("sequelize");

const app = express();
const sequelize = new Sequelize(process.env.DATABASE_URL);

app.use(express.json());

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  }
);

app.get("/api/blogs", async (req, res) => {
  try {
    const notes = await Blog.findAll();
    console.log(JSON.stringify(notes, null, 2));
    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    console.log(JSON.stringify(blog, null, 2));
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
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

app.listen(process.env.PORT || 3002, () => {
  console.log("Server listening on port 3002");
});
