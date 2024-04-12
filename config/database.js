// config/database.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();
// Create a Sequelize instance and connect to your MySQL database
const sequelize = new Sequelize(
  "HREmployeeOnboarding",
  "root",
  process.env.password,
  {
    host: "127.0.0.1",
    dialect: "mysql",
  }
);

module.exports = sequelize;
