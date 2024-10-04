const Blog = require("./Blog");
const ReadingList = require("./reading_list");
const User = require("./User");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "reading_list_blogs" });
Blog.belongsToMany(User, { through: ReadingList, as: "reading_list_users" });

// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User, ReadingList };
