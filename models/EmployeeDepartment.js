const { DataTypes } = require("sequelize");
const db = require("../config/database");

const EmployeeDepartment = db.define(
  "EmployeeDepartment",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nameOfLineManager: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    branch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameOfDepartment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gradeOfEmployee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  { tableName: "EmployeeDepartment" }
);

module.exports = EmployeeDepartment;
